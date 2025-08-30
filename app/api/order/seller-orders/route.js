import connectDB from "@/config/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    await connectDB();

    const orders = await Order.find({})
      .populate("address")
      .populate("items.product");

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
