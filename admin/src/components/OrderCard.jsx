import React from "react";
import { assets } from "../assets/assets"; // parcel_icon etc.

const OrderCard = ({ order }) => {
  const statusOptions = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered",
  ];

  return (
    <div className="border rounded-lg p-4 sm:p-6 shadow-sm bg-white mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <img src={assets.parcel_icon} alt="Parcel" className="w-8 h-8" />
        <h2 className="text-lg font-semibold">Order Summary</h2>
      </div>

      {/* Items */}
      <div className="text-sm text-gray-700 mb-4 space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <img
              src={
                Array.isArray(item.productId?.image)
                  ? item.productId.image[0]
                  : item.productId?.image || "/fallback.png"
              }
              alt={item.productId?.name || "Product"}
              className="w-12 h-12 object-cover rounded"
            />
            <p>
              <strong>{item.productId?.name || "Product"}</strong> ×{" "}
              {item.quantity}{" "}
              <span className="text-gray-500">({item.size})</span>
            </p>
          </div>
        ))}
      </div>

      {/* Store + Address */}
      <div className="text-sm text-gray-700 mb-2">
        <p><strong>Store:</strong> Great Stock</p>
        <p>
          <strong>Address:</strong> {order.address?.street}, {order.address?.city},{" "}
          {order.address?.state}, {order.address?.country}, {order.address?.zip}
        </p>
        <p><strong>Phone:</strong> {order.address?.phone}</p>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4 text-sm text-gray-700">
        <p><strong>Items:</strong> {order.items.length}</p>
        <p><strong>Price:</strong> ₹{order.amount}</p>
        <p><strong>Method:</strong> {order.paymentMethod}</p>
        <p><strong>Payment:</strong> {order.payment ? "Paid" : "Pending"}</p>
        <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
        <div>
          <label htmlFor={`status-${order._id}`} className="block font-medium mb-1">
            Status:
          </label>
          <select
            id={`status-${order._id}`}
            defaultValue={order.status}
            className="border rounded px-2 py-1 w-full"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;