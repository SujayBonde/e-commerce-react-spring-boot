import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const statusColors = {
  "Order Placed": "bg-blue-100 text-blue-700",
  "Packing": "bg-yellow-100 text-yellow-700",
  "Shipped": "bg-purple-100 text-purple-700",
  "Out for Delivery": "bg-orange-100 text-orange-700",
  "Delivered": "bg-green-100 text-green-700",
};

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Your session has expired. Please log in again.");
      } else {
        toast.error(error.response?.data?.message || "Failed to load orders.");
      }
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success("Order status updated!");
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 403) {
        toast.error("Your session has expired. Please log in again.");
      } else {
        toast.error(error.response?.data?.message || "Failed to update order status.");
      }
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="px-2">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">All Orders</h2>

      {orders.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <img src={assets.parcel_icon} className="w-16 mx-auto mb-4 opacity-30" alt="No orders" />
          <p className="text-lg">No orders found</p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-4"
          >
            {/* ── Top Row: parcel icon + Order meta ── */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <img className="w-10 h-10" src={assets.parcel_icon} alt="Order" />
                <div>
                  <p className="text-xs text-gray-400 font-mono">#{order.id?.slice(0, 16)}...</p>
                  <p className="text-sm font-medium text-gray-700 mt-0.5">
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Payment + Amount badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                  {order.status}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.payment ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {order.payment ? "Paid" : "Pending"}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                  {order.paymentMethod}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {currency}{order.amount}
                </span>
              </div>
            </div>

            {/* ── Divider ── */}
            <hr className="border-gray-100" />

            {/* ── Middle: Items + Address side by side ── */}
            <div className="flex gap-6 flex-wrap">

              {/* Items list with images */}
              <div className="flex-1 min-w-[240px]">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Items ({order.items?.length})
                </p>
                <div className="flex flex-col gap-3">
                  {order.items?.map((item, i) => {
                    const product = item.productId;
                    const imageUrl =
                      product?.image?.[0]
                        ? product.image[0].startsWith("http")
                          ? product.image[0]
                          : backendUrl + "/" + product.image[0]
                        : null;

                    return (
                      <div key={i} className="flex items-center gap-3">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={product?.name || "Product"}
                            className="w-14 h-14 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-300 text-xs">No img</span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {product?.name || "Unknown Product"}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: <span className="font-semibold">{item.quantity}</span>
                            {item.size && (
                              <span className="ml-2">
                                Size: <span className="font-semibold">{item.size}</span>
                              </span>
                            )}
                          </p>
                          {product?.price && (
                            <p className="text-xs text-gray-400">{currency}{product.price} each</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="min-w-[200px]">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Delivery Address
                </p>
                <div className="text-sm text-gray-700 leading-6">
                  {order.address?.firstName || order.address?.lastName ? (
                    <p className="font-semibold text-gray-800">
                      {order.address.firstName} {order.address.lastName}
                    </p>
                  ) : null}
                  {order.address?.street && <p>{order.address.street}</p>}
                  {(order.address?.city || order.address?.state) && (
                    <p>
                      {order.address.city}{order.address.state ? `, ${order.address.state}` : ""}
                    </p>
                  )}
                  {order.address?.zipcode && <p>{order.address.zipcode}</p>}
                  {order.address?.country && <p>{order.address.country}</p>}
                  {order.address?.phone && (
                    <p className="text-gray-500 text-xs mt-1">📞 {order.address.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Bottom: Status Selector ── */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Update Status:
              </label>
              <select
                onChange={(e) => statusHandler(e, order.id)}
                value={order.status}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
