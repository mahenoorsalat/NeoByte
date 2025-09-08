import connectDB from "@/config/db";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Ensure DB is connected before queries
    await connectDB();

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // ✅ Only fetch orders for this seller
    const orders = await Order.find({ seller: userId })
      .populate("items.product");

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("GET /orders error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
