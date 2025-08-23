
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },   // Clerk user ID
  email: { type: String, required: true },
  name: { type: String },
  imageUrl: { type: String },
    cartItems: {type: Object , default:{} }
} , {minimize:false})

export default mongoose.models.User || mongoose.model("User", UserSchema);
