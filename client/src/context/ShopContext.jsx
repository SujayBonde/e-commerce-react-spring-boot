import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendURL + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        if (error.response?.status === 403) {
          toast.error("Your session has expired. Please log in again.");
        } else {
          toast.error(error.response?.data?.message || "Failed to add item to cart. Please try again.");
        }
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          toast.error(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendURL + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        if (error.response?.status === 403) {
          toast.error("Your session has expired. Please log in again.");
        } else {
          toast.error(error.response?.data?.message || "Failed to update cart. Please try again.");
        }
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
  
    for (const productId in cartItems) {
      // Find product by ID
      const itemInfo = products.find((product) => product.id.toString() === productId);
  
      // If product not found, skip this cart entry
      if (!itemInfo) {
        console.warn("Product not found for cart item:", productId);
        continue;
      }
  
      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];
  
        if (quantity > 0) {
          totalAmount += itemInfo.price * quantity;
        }
      }
    }
  
    return totalAmount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendURL + "/api/product/list");
      console.log("Fetched products:", response.data); // Debug log
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.message || "Failed to load products. Please refresh the page.");
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendURL + "/api/cart/get",
        {},
        { headers: { token } }
      );
      console.log("🧺 Cart data from backend:", response.data.cartData);
      if (response.data.success) {
        setCartItems(response.data.cartData);
       
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 403) {
        toast.error("Your session has expired. Please log in again.");
      } else {
        toast.error(error.response?.data?.message || "Failed to load your cart.");
      }
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"))
    }
  }, []);

  

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendURL,
    setToken,
    token,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
