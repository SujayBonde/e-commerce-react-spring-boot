import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";

const Orders = () => {
  const { backendURL, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return null;

      const response = await axios.post(
        backendURL + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item["status"] = order.status;
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-10 px-4 sm:px-6 lg:px-8">
      <div className="text-2xl mb-6">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div className="space-y-6">
        {orderData.map((item, index) => (
          <div
            key={index}
            className="p-4 sm:p-6 border rounded-lg shadow-sm bg-white flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            {/* Product Info */}
            <div className="flex items-start gap-4 sm:gap-6 text-sm md:text-base flex-wrap">
              <img
                src={
                  Array.isArray(item.productId?.image)
                    ? item.productId.image[0]
                    : item.productId?.image || "/fallback.png"
                }
                alt={item.productId?.name || "Product"}
                className="w-20 h-20 object-cover rounded-md"
              />

              <div className="flex flex-col gap-2">
                <p className="font-medium text-base sm:text-lg">
                  {item.productId?.name}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-gray-700">
                  <p>
                    {currency}
                    {item.productId?.price}
                  </p>
                  <p>Qty: {item.quantity}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p className="text-sm text-gray-500">
                  Date: {new Date(item.date).toDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Payment: {item.paymentMethod}
                </p>
              </div>
            </div>

            {/* Status + Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:w-1/3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <p className="text-sm md:text-base">{item.status}</p>
              </div>
              <button
                onClick={loadOrderData}
                className="w-full sm:w-auto border px-4 py-2 text-sm font-medium rounded-md bg-gray-50 hover:bg-purple-100 transition"
              >
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;