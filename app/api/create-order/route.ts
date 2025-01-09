import Order from "@/models/Order";
import { auth } from "@/utils/auth";
import { connectToDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {

    const reqBody = await request.json()
    const { amount, message, attachmentURL } = reqBody
    console.log(amount, message, attachmentURL)
    const session = await auth()
    const userId = session?.user?.id

    try {

        await connectToDB()
        
        const razorpayOrder = razorpay.orders.create({
            amount: Math.round(amount * 100),  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            receipt: `payment_${Date.now()}_${Math.round(Math.random() * 1000)}`,
            notes: {
                userId: session?.user?.id || ""
            }
        });

        const newOrder = await Order.create({
            userId: userId,
            amount: Number((await razorpayOrder)?.amount),
            currency: "INR",
            message: message,
            attachmentURL: attachmentURL,
            status: "pending",
            razorpayOrderId: (await razorpayOrder)?.id,
        })

        return NextResponse.json({
            orderId: (await razorpayOrder).id,
            amount: Number((await razorpayOrder).amount),
            currency: "INR",
            DB_orderId: newOrder._id
        }, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: "ERROR! Unable to Order: " + error.message}, {status: 500})

    }

}