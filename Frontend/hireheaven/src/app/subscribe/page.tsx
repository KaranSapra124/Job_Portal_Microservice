"use client"
import useRazorpay from '@/components/scriptLoader'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import Cookies from "js-cookie"
import axios from 'axios';
import { payment_service, useAppData } from '@/context/appContext';
import toast from 'react-hot-toast';
import Loading from '@/components/ui/loading';
import { Check, Zap, Star, ShieldCheck, Rocket } from "lucide-react";

declare global {
    interface Window {
        Razorpay?: any;
    }
}

const SubscriptionPage = () => {
    const razorpayLoaded = useRazorpay();
    const { setUser } = useAppData()
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const handleSubscribe = async () => {
        const token = Cookies.get("token")
        setLoading(true);
        const { data: { order } } = await axios.post(`${payment_service}/api/payment/checkout`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const options = {
            "key": "rzp_test_RugHIvwnZFYrSQ", // Enter the Key ID generated from the Dashboard
            "amount": order?.id, // Amount is in currency subunits. 
            "currency": "INR",
            "name": "Hire Heaven", //your business name
            "description": "Fnd job easily",
            "image": "https://example.com/your_logo",
            "order_id": order?.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            "handler": async function (res: any) {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = res;
                try {
                    const { data } = await axios.post(`${payment_service}/api/payment/verify-payment`, {
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }

                    )
                    toast?.success(data?.message);
                    setUser(data?.updatedUser);
                    router.push("/payment/success/" + razorpay_payment_id);
                    setLoading(false)
                } catch (err: any) {
                    setLoading(false)
                    toast.error(err?.response?.data?.message || "Payment verification failed");
                }
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        if (!razorpayLoaded) {
            console.log("Something went wrong with script")
        }
        const razorpay = new window.Razorpay(options)
        razorpay.open();
    }
    if (loading) return <Loading />


    return (
        <div className="min-h-screen bg-[#f8fafc] py-20 px-4">
            {/* Header Section */}
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-3">
                    Premium Access
                </h2>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                    Get Hired <span className="text-blue-600 italic">Faster</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    Join our premium tier to get your applications prioritized by top recruiters and unlock advanced career tools.
                </p>
            </div>

            {/* Pricing Card Container */}
            <div className="max-w-md mx-auto relative">
                {/* Decorative background glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25"></div>

                <div className="relative bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Card Header */}
                    <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                                Most Popular
                            </span>
                            <Zap className="text-blue-600 fill-blue-600" size={24} />
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-gray-900">₹119</span>
                            <span className="text-gray-400 font-bold">/lifetime</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-4 font-medium">
                            One-time payment. Unlimited priority applications.
                        </p>
                    </div>

                    {/* Features List */}
                    <div className="p-8 space-y-6">
                        <ul className="space-y-4">
                            {[
                                { title: "Priority Application", desc: "Show up at the top of recruiter's list", icon: <Rocket size={18} /> },
                                { title: "AI Resume Analyzer", desc: "Get real-time feedback on your CV", icon: <Star size={18} /> },
                                { title: "Direct Recruiter Chat", desc: "Unlock messaging for top job posts", icon: <Check size={18} /> },
                                { title: "Verified Badge", desc: "Get a blue tick on your profile", icon: <ShieldCheck size={18} /> }
                            ].map((feature, i) => (
                                <li key={i} className="flex gap-4">
                                    <div className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 leading-none">{feature.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">{feature.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Subscription Button */}
                        <button
                            onClick={handleSubscribe}
                            className="w-full bg-blue-600 hover:bg-gray-900 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] flex items-center justify-center gap-2 text-lg group"
                        >
                            Upgrade Now
                            <Zap size={20} className="group-hover:animate-pulse" />
                        </button>

                        <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                            Secure checkout via Razorpay
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Support link */}
            <p className="text-center mt-12 text-sm text-gray-500 font-medium pb-10">
                Questions? <span className="text-blue-600 cursor-pointer hover:underline">Contact Support</span>
            </p>
        </div>
    );

}

export default SubscriptionPage