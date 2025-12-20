"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { auth_service } from '@/context/appContext';

const ResetPage = () => {
    const router = useRouter();
    const { id } = useParams(); // Grabbing token from /reset-password/[token]

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setIsLoading(true);
        try {
            // Example API call using the token from params
            const { data } = await axios.post(`${auth_service}/api/auth/reset/${id}`, {
                password: formData.password
            });

            toast.success(data?.message);
            setTimeout(() => router.push('/login'), 2000);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f9fafb] px-4">
            <div className="max-w-md w-full">
                {/* Logo or Brand Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Create new password</h2>
                        <p className="text-gray-500 mt-2 text-sm">
                            Please enter something strong and easy to remember.
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-all h-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-all h-12"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all mt-4"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Updating...
                                </div>
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>
                </div>

                <p className="text-center mt-8 text-sm text-gray-500">
                    Remember your password?
                    <button onClick={() => router.push('/login')} className="ml-1 text-blue-600 font-semibold hover:underline">
                        Back to login
                    </button>
                </p>
            </div>
        </div>
    )
}

export default ResetPage