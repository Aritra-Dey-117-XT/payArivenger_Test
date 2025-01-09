import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto"
import { connectToDB } from "@/utils/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {

    try {

        const reqBody = await req.text()
        const signature = req.headers.get("x-razorpay-signature")

        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
                                        .update(reqBody)
                                        .digest("hex")

        if(signature !== expectedSignature) {
            return NextResponse.json({error: "Invalid Signture"}, {status: 400})
        }

        const event = JSON.parse(reqBody)
        await connectToDB()

        if(event.event === "payment.captured") {
            const payment = event.payload.payment.entity

            const order = await Order.findByIdAndUpdate(
                {razorpayOrderId: payment.order_id},
                {
                    razorpayPaymentId: payment.id,
                    status: "captured"
                }
            ).populate([
                {path: "userId", select: "email"}
            ])

            if(order) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false, // true for port 465, false for other ports
                    auth: {
                        user: process.env.GMAIL_USERNAME,
                        pass: process.env.GMAIL_PASSWORD,
                    },
                });

                await transporter.sendMail({
                    from: 'aritradey2715@gmail.com', // sender address
                    to: order.userId.email, // list of receivers
                    subject: "Order Completed", // Subject line
                    text: `Your Order has been completed!`, // plain text body
                });

            }
        }

        return NextResponse.json({message: "SUCCESS!"}, {status: 200})
        
    } catch (error: any) {
        return NextResponse.json({error: "Couldn't place Order: " + error.message}, {status: 500})
    }
}