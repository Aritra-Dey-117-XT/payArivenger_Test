import { Schema, model, models } from "mongoose";

const orderSchema = new Schema({
    email: {type: String, required: true},
    amount: {type: Number, required: true},
    currency: {type: String, required: true},
    message: {type: String},
    imageURL: {type: String},
    status: {type: String, emun: ["pending", "captured", "failed"], required: true, default: "pending"},
    razorpayOrderId: {type: String, required: true},
    razorpayPaymentId: {type: String, required: true, default: "pendingPayment"},
}, {timestamps: true})

const Order = models?.Order || model("Order", orderSchema)
export default Order