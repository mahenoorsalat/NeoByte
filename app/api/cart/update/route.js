import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { cartData } = await request.json();
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    user.cartItems = cartData || {};
    await user.save();

    return NextResponse.json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
