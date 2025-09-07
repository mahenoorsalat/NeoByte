import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "User" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
    },
  ],
  address: {
    fullName: String,
    area: String,
    city: String,
    state: String,
    phoneNumber: String,
    pincode: String,
  },
  amount: { type: Number, required: true },
  status: { type: String, default: "Order Placed" },
  date: { type: Date, default: Date.now },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
