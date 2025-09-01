import connectDB from "@/config/db";
import Order from "@/models/Order";

export async function POST(request){
  try{
    const { userId } = getAuth(request);
    const { address , items } = await request.json();

    if(!address || items.length === 0){
      return NextResponse.json({ success:false , message : "Invalid data" });
    }

    await connectDB();

    // calculate amount
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      amount += product.offerPrice * item.quantity;
    }

    // ✅ Save order in DB
    const order = await Order.create({
      userId,
      address,
      items,
      amount: amount + Math.floor(amount*0.02),
      status: "Pending",
      createdAt: new Date(),
    });

    // 🔔 still trigger inngest for async processing if needed
    await inngest.send({
      name:'order/created',
      data:{ ...order.toObject() }
    });

    // clear user cart
    const user = await User.findById(userId);
    user.cartItems = [];
    await user.save();

    return NextResponse.json({ success:true , message:"Order Placed", order });
  } catch (error) {
    return NextResponse.json({ success:false , message:error.message });
  }
}
