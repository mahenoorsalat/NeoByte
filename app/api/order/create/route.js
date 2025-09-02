import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import Address from "@/models/Address";
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json(); // address = addressId

    if (!address || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    await connectDB();

    // ✅ fetch full address from DB
    const addressDoc = await Address.findById(address);
    if (!addressDoc) {
      return NextResponse.json({ success: false, message: "Address not found" });
    }

    // ✅ calculate order amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: "Product not found" });
      }
      amount += product.offerPrice * item.quantity;
    }
    const totalAmount = amount + Math.floor(amount * 0.02);

    // ✅ create order with all required fields
    const newOrder = await Order.create({
      userId,
      address: {
        fullName: addressDoc.fullName,
        phoneNumber: addressDoc.phoneNumber,
        pincode: addressDoc.pincode,
        area: addressDoc.area,
        city: addressDoc.city,
        state: addressDoc.state,
      },
      items,
      amount: totalAmount,
      date: Date.now(),
      status: "Pending",
    });

    // optional event
    await inngest.send({
      name: "order/created",
      data: newOrder.toObject(),
    });

    // ✅ clear cart
    const user = await User.findById(userId);
    user.cartItems = [];
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Order Placed",
      order: newOrder,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
