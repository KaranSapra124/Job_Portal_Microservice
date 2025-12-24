"use client"
import React, { ChangeEvent, useRef, useState } from 'react'
import Link from 'next/link'
import {
    Briefcase, Camera, Edit, FileText, Mail,
    NotepadText, Phone, UserIcon, CheckCircle2,
    Crown, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAppData } from '@/context/appContext'
import { AccountProps } from '@/type'

const Info: React.FC<AccountProps> = ({ user, isYourAccount }) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const editRef = useRef<HTMLButtonElement | null>(null);
    const resumeRef = useRef<HTMLInputElement | null>(null);

    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("")
    const [bio, setBio] = useState("");

    const { updateProfilePic, updateResume, btnLoading, updateUser } = useAppData()

    const handleClick = () => inputRef.current?.click()

    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            updateProfilePic(formData)
        }
    }

    const handleEditClick = () => {
        editRef.current?.click();
        setName(user.name);
        setPhoneNumber(user.phone_number);
        setBio(user?.bio || "")
    }

    const updateProfileHandler = () => updateUser(name, phoneNumber, bio);

    const changeResume = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file?.type !== "application/pdf") {
                alert("Please upload a pdf file!")
                return;
            }
            const formData = new FormData();
            formData.append("file", file);
            updateResume(formData)
        }
    }

    return (
        <div className=' mx-auto px-4  space-y-8'>
            <Card className='overflow-hidden border-none shadow-2xl bg-card'>
                {/* Header/Cover Section */}
                <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                    <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-3xl border-4 border-background shadow-2xl overflow-hidden bg-muted">
                                <img
                                    src={user?.profile_pic || "https://avatar.iran.liara.run/public/3"}
                                    alt="Profile"
                                    className='w-full h-full object-cover transition-transform group-hover:scale-110'
                                />
                            </div>
                            {isYourAccount && (
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    onClick={handleClick}
                                    className='absolute -bottom-2 -right-2 rounded-xl h-10 w-10 shadow-xl border-2 border-background'
                                >
                                    <Camera size={18} />
                                </Button>
                            )}
                            <input type="file" className='hidden' accept='image/*' ref={inputRef} onChange={changeHandler} />
                        </div>
                    </div>
                </div>

                <CardContent className="md:pt-12 pt-10 pb-2 px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <h1 className="md:text-4xl text-xl font-black tracking-tight">{user.name}</h1>
                                {user?.subscription && (
                                    <Badge className="bg-amber-500 hover:bg-amber-600 gap-1 text-[10px] font-black uppercase tracking-widest">
                                        <Crown size={12} /> PRO
                                    </Badge>
                                )}
                                {isYourAccount && (
                                    <Button variant="ghost" className='rounded-full hover:bg-blue-50' onClick={handleEditClick} size="icon">
                                        <Edit size={18} className="text-blue-600" />
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center gap-2 md:gap-4 text-sm font-bold text-muted-foreground uppercase tracking-widest">
                                <span className="flex  items-center text-xs gap-1.5"><Briefcase size={16} /> {user?.role}</span>
                                <span className="flex items-center text-xs gap-1.5"><CheckCircle2 size={16} className="text-green-500" /> Verified</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {user.role === "jobseeker" && (
                                <Button onClick={() => resumeRef.current?.click()} variant={"outline"} className="rounded-xl cursor-pointer font-bold gap-2">
                                    <NotepadText size={18} /> Update Resume
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Bio Section */}
                    {user.bio && (
                        <div className="mt-10 p-2 md:p-4 rounded bg-blue-50/50 border border-blue-100/50">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-2 flex items-center gap-2">
                                <FileText size={14} /> Professional Summary
                            </h3>
                            <p className="text-gray-700 leading-relaxed font-bold md:text-sm text-xs">{user.bio}</p>
                        </div>
                    )}

                    {/* Info Grid */}
                    <div className="grid md:grid-cols-2 gap-4 mt-8">
                        <div className="md:p-3 p-2 rounded border bg-gray-50/30 flex items-center gap-4">
                            <div className="md:h-12 h-10 md:w-12 w-10 rounded bg-white border shadow-sm flex items-center justify-center text-blue-600">
                                <Mail size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</p>
                                <p className="text-sm font-bold truncate">{user?.email}</p>
                            </div>
                        </div>

                        <div className="md:p-3 p-2 rounded border bg-gray-50/30 flex items-center gap-4">
                            <div className="md:h-12 h-10 md:w-12 w-10 rounded bg-white border shadow-sm flex items-center justify-center text-blue-600">
                                <Phone size={20} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</p>
                                <p className="text-sm font-bold truncate">{user?.phone_number || "Not provided"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Resume & Subscription Row */}
                    {user.role === "jobseeker" && (
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            {/* Resume Card */}
                            <div className="md:p-3 p-2  rounded-xl  border-red-600 border-l-4 bg-red-50/20 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-white border border-red-100 flex items-center justify-center text-red-600">
                                        <NotepadText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Resume.pdf</p>
                                        <Link href={user?.resume || "#"} target="_blank" className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1">
                                            View Document <ExternalLink size={10} />
                                        </Link>
                                    </div>
                                </div>
                                <input type="file" ref={resumeRef} className='hidden' accept='application/pdf' onChange={changeResume} />
                            </div>

                            {/* Subscription Card */}
                            <div className={`md:p-3 p-2  rounded-2xl border-l-4 flex items-center justify-between ${user?.subscription ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200 bg-gray-50/30'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-xl bg-white border flex items-center justify-center ${user?.subscription ? 'text-amber-500 border-amber-200' : 'text-gray-400'}`}>
                                        <Crown size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{user?.subscription ? "Premium Plan" : "Free Plan"}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Account Status</p>
                                    </div>
                                </div>
                                <Button size="sm" variant={user?.subscription ? "outline" : "default"} asChild className="rounded-lg font-bold h-8">
                                    <Link href="/subscribe">{user?.subscription ? "Manage" : "Upgrade"}</Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialog for editing */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button ref={editRef} className='hidden'>Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                <Input id='name' className='pl-10 h-12 rounded-xl bg-muted/50 border-none' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                <Input id='phone' className='pl-10 h-12 rounded-xl bg-muted/50 border-none' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                            </div>
                        </div>
                        {user.role === "jobseeker" && (
                            <div className="space-y-2">
                                <Label htmlFor="bio" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Bio / Summary</Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                    <Input id='bio' className='pl-10 h-12 rounded-xl bg-muted/50 border-none' value={bio} onChange={(e) => setBio(e.target.value)} />
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button disabled={btnLoading} onClick={updateProfileHandler} className='w-full h-12 rounded-xl font-bold text-lg shadow-lg shadow-blue-200'>
                            {btnLoading ? "Saving Changes..." : "Save Profile Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Info