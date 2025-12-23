"use client"
import { auth_service, useAppData } from '@/context/appContext';
import axios from 'axios';
import { redirect } from 'next/navigation';
import React, { FormEvent, useState } from 'react'
import toast from 'react-hot-toast';
import Cookies from "js-cookie"
import { ArrowRight, Briefcase, GraduationCap, Lightbulb, Lock, Mail, Phone, User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/loading';
const RegisterPage = () => {
    const [name, setName] = useState("");
    const [role, setRole] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [bio, setBio] = useState("")
    const [resume, setResume] = useState<File | null>(null)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [btnLoading, setBtnLoading] = useState(false);
    const { isAuth, setUser, loading, setIsAuth } = useAppData()
    if (isAuth) return redirect("/");
    if (loading) {
        return <Loading />
    }
    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBtnLoading(true)
        try {
            const formData = new FormData()
            formData.append("role", role);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("phoneNumber", phoneNumber);

            if (role === "jobseeker") {
                formData.append("bio", bio);
                if (resume) {
                    formData.append("file", resume);
                }
            }

            const { data } = await axios.post(`${auth_service}/api/auth/register`, formData);
            toast.success(data?.message);
            Cookies.set("token", data?.token, {
                expires: 15,
                secure: false,
                path: '/',
            })
            setUser(data?.registeredUser)
            setIsAuth(true)
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
            setIsAuth(false)
        } finally {
            setBtnLoading(false)
        }
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">
                            Join HireHeaven
                        </h1>
                        <p className="text-sm opacity-70">Create your account to start a new journey</p>
                    </div>
                    <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
                        <form onSubmit={submitHandler} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-sm font-medium">
                                    I want to
                                </Label>
                                <div className="relative">
                                    <Briefcase className="icon-style" />
                                    <select
                                        id="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full h-11 pl-10 pr-4 border-2 border-gray-300 rounded-md bg-transparent"
                                        required
                                    >
                                        <option value="">Select your role</option>
                                        <option value="jobseeker">Find a Job</option>
                                        <option value="recruiter">Hire Talent</option>
                                    </select>
                                </div>

                            </div>
                            {
                                role && <div className='space-y-5 animate-in fade-in duration-300'>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">Full Name</Label>
                                        <div className="relative">
                                            <User className="icon-style" />
                                            <input
                                                id="name"
                                                type="text"
                                                placeholder="Enter your name..."
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                                className="pl-10 h-11"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="icon-style" />
                                            <input
                                                id="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="pl-10 h-11"
                                            />
                                        </div>
                                    </div>
                                    {role === "jobseeker" && <>
                                        <div className="space-y-2">
                                            <Label htmlFor="role" className="text-sm font-medium">Resume (PDF)</Label>
                                            <div className="relative">
                                                <GraduationCap className="icon-style" />
                                                <input
                                                    id="resume"
                                                    type="file"
                                                    placeholder="Choose your resume"
                                                    accept='application/pdf'
                                                    onChange={(e) => {
                                                        if (e.target.files && e.target.files[0]) {
                                                            setResume(e.target.files[0])
                                                        }
                                                    }}
                                                    required
                                                    className=" h-11 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                                            <div className="relative">
                                                <Lightbulb className="icon-style" />
                                                <input
                                                    id="bio"
                                                    type="text"
                                                    placeholder="Add your bio..."
                                                    value={bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                    required
                                                    className="pl-10 h-11"
                                                />
                                            </div>
                                        </div>
                                    </>}
                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="icon-style" />
                                            <input
                                                id="phoneNumber"
                                                type="number"
                                                placeholder="1234567890"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                required
                                                className="pl-10 h-11"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                        <div className="relative">
                                            <Lock className="icon-style" />
                                            <input
                                                id="password"
                                                type="password"
                                                placeholder="******"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="pl-10 h-11"
                                            />
                                        </div>
                                    </div>
                                    <Button disabled={btnLoading} className='w-full'>{btnLoading ? "Creating account..." : "Register"}
                                        <ArrowRight size={18} />
                                    </Button>

                                </div>
                            }

                            {/* <div className="flex items-center justify-end">
                                <Link href={"/forgot"} className='text-sm text-blue-500 hover:underline transition-all'>
                                    Forgot Password?

                                </Link>
                            </div> */}

                        </form>
                        <div className="mt-6 pt-6 border-t border-gray-400 ">
                            <p className='text-center text-sm'>Alerady have an account? <Link href={"/login"} className='text-sm text-blue-500 hover:underline transition-all font-medium'>Login</Link></p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default RegisterPage