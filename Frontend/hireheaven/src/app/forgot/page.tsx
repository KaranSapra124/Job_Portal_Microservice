"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios';
import { auth_service, useAppData } from '@/context/appContext';
import { redirect } from 'next/navigation';

const ForgotPage = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const { isAuth } = useAppData()
    if (isAuth) return redirect("/")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Replace with your actual auth service URL
            const { data } = await axios.post(`${auth_service}/api/auth/forgot`, { email });

            toast.success(data?.message);
            setIsSent(true);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                        <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                {!isSent ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-11"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending Link...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>
                ) : (
                    <div className="mt-6 p-4 bg-green-50 rounded-lg text-center">
                        <p className="text-sm text-green-700 font-medium">
                            Check your inbox! We've sent a password reset link to <br />
                            <span className="font-bold">{email}</span>
                        </p>
                        <Button
                            variant="link"
                            onClick={() => setIsSent(false)}
                            className="mt-2 text-blue-600"
                        >
                            Didn't get the email? Try again
                        </Button>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-6">
                    <Link
                        href="/login"
                        className="flex items-center justify-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ForgotPage