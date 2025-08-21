import mongoose, { mongo } from "mongoose";

let cached = global.mongoose

if(!cached){
    cached = global.mongoose = {conn: null , promise: null}
}

async function connectDB(params) {
    if(cached.conn){
        return cached.conn
    }
    if(!cached.promise){
        const opts = {
            bufferCommands:false
        }

        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}\NeoByte` , opts).then(mongoose =>{
            return mongoose
        })
    }
    cached.conn = await cached.promise
    return cached.conn
}

export default connectDB;