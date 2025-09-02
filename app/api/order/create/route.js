import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!address || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" });
    }

    await connectDB();

    // calculate amount properly
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      amount += product.offerPrice * item.quantity;
    }

    // create order
    const newOrder = await Order.create({
      userId,
      address,
      items,
      amount: amount + Math.floor(amount * 0.02),
      date: Date.now(),
      status: "Pending",
    });

    // optional: still send inngest event
    await inngest.send({
      name: "order/created",
      data: newOrder.toObject(),
    });

    // clear cart
    const user = await User.findById(userId);
    user.cartItems = [];
    await user.save();

    return NextResponse.json({ success: true, message: "Order Placed", order: newOrder });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}