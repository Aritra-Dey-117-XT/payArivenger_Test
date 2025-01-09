import { model, models, Schema } from "mongoose";

const orderSchema = new Schema({
    userId: {type: String, require: true},
    amount: {type: Number, required: true},
    currency: {type: String, required: true},
    message: {type: String},
    attachmentURL: {type: String},
    status: {type: String, enum: ["pending", "completed", "failed"], required: true, default: "pending"},
    razorpayOrderId: {type: String, required: true},
    razorpayPaymentId: {type: String, required: true, default: "pending_Payment"}
}, {timestamps: true})

const Order = models.Order || model("Order", orderSchema)
export default Order