import { connectToDB } from "@/utils/db";
import Order from "@/models/Order";
import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/utils/auth";

const instance = new Razorpay({ 
    key_id: process.env.RAZORPAY_KEY_ID!, 
    key_secret: process.env.RAZORPAY_KEY_SECRET!
})

export async function POST(request: NextRequest) {

    const reqBody = await request.json()
    const { amount, message, imageURL } = reqBody
    const session = await auth()
    const userId = session?.user?.id
    try {
        const rzpOrder = instance.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `order_receipt_${Date.now()}_${Math.round(Math.random() * 1000)}`,
            notes: {
                email: session?.user?.email!
            }
        });

        const newOrder = await Order.create({
            email: session?.user?.email!,
            amount: amount,
            currency: "INR",
            message,
            imageURL,
            status: "pending",
            razorpayOrderId: (await rzpOrder)?.id,
        })

        return NextResponse.json({
            orderId: (await rzpOrder)?.id,
            amount: amount,
            currency: "INR",
            DB_orderId: newOrder._id
        }, {status: 200})

    } catch(error) {
        return NextResponse.json({error}, {status: 500})
    }
}