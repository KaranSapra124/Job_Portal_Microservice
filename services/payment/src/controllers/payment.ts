import { TryCatch } from "../utils/TryCatch.js";
import { AuthenticatedRequest } from "../middleware/auth.js"
import Errorhandler from "../utils/errorHandler.js";
import { sql } from "../utils/db.js";
import { instance } from "../index.js";
import crypto from "crypto"
export const checkout = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req?.user) {
        throw new Errorhandler(401, "No valid user!")
    }
    const userId = req?.user?.user_id;
    const [user] = await sql`SELECT * FROM users WHERE user_id=${userId}`
    const subTime = user?.subscription ? new Date(user?.subscription)?.getTime() : 0;

    const now = Date.now();
    const isSubscribed = subTime > now;

    if (isSubscribed) {
        throw new Errorhandler(400, "User already subscribed");
    }

    const options = {
        amount: Number(119 * 100),
        currency: "INR",
        notes: {
            user_id: userId?.toString(),
        }
    }
    const order = await instance.orders.create(options);
    res.status(201).json({
        order
    })
})

export const paymentVerification = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req?.user) {
        throw new Errorhandler(401, "No valid user!")
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET as string).update(body).digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        const now = new Date();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;

        const expiryDate = new Date(now?.getTime() + thirtyDays)

        const [updatedUser] = await sql`UPDATE users SET subscription = ${expiryDate} WHERE user_id = ${req?.user?.user_id} RETURNING *`

        res.json({
            message: "Subscription Purchased Successfully!",
            updatedUser
        })
    } else {
        return res.status(400).json({
            message: "Payment Failed"
        })
    }

})
