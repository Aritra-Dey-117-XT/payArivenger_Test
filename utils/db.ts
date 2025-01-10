// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI;
// console.log(MONGODB_URI)

// if (!MONGODB_URI) {
//     throw new Error(
//       `Please define the MONGODB_URI environment variable inside ".env.local" ${MONGODB_URI}`
//     );
// }

// /**
//  * Global is used here to maintain a cached connection across hot reloads
//  * in development. This prevents connections growing exponentially
//  * during API Route usage.
//  */
// let cached = global.mongoose;

// if (!cached) {
//     cached = global.mongoose = { conn: null, promise: null };
// }

// export async function connectToDB() {
//     if (cached.conn) {
//         return cached.conn;
//     }

//     if (!cached.promise) {
//       const opts = {
//         bufferCommands: false,
//       };

//       cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
//         return mongoose.connection;
//       });
//     }

//     try {
//       cached.conn = await cached.promise;
//     } catch (e) {
//       cached.promise = null;
//       throw e;
//     }

//     return cached.conn;
// }

import mongoose from "mongoose"

let isConnected = false

export const connectToDB = async () => {

    mongoose.set("strictQuery", true)
    
    if(isConnected) {
        console.log("Already Connected To MongoDB Database!")
        return;
    }

    try {
        
        await mongoose.connect(process.env.MONGODB_URI!)

        isConnected = true
        console.log("Connected To MongoDB Database!")

    } catch (error: any) {
        console.log(error)
        throw new error;
    }
}