import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppData } from '@/context/appContext'
import { AccountProps } from '@/type'

import { Briefcase, Camera, Edit, FileText, Mail, NotepadText, Phone, UserIcon } from 'lucide-react'
import Link from 'next/link'
import React, { ChangeEvent, useRef, useState } from 'react'

const Info: React.FC<AccountProps> = ({ user, isYourAccount }) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const editRef = useRef<HTMLButtonElement | null>(null);
    const resumeRef = useRef<HTMLInputElement | null>(null);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("")
    const [bio, setBio] = useState("");
    const { updateProfilePic, updateResume, btnLoading, updateUser } = useAppData()

    const handleClick = () => {
        inputRef.current?.click()
    }
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

    const updateProfileHandler = () => {
        updateUser(name, phoneNumber, bio)
    };
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
    const handleResumeClick = () => {
        resumeRef.current?.click();

    }

    return (
        <div className='max-w-5xl mx-auto px-4 py-8'>
            <Card className='overflow-hidden shadow-lg border-2'>
                <div className="h-32 bg-blue-500 relative">
                    <div className="absolute -bottom-10 left-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full border-2    shadow-xl bg-background">
                                <img src={user?.profile_pic ? user?.profile_pic : "data:image/jpeg;base64,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"} alt="" className='w-32 h-32 object-cover rounded-full' />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main Content */}
                <div className="pt-20 pb-8 px-8">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold">{user.name}</h1>
                                {/* Edit button */}
                                {isYourAccount && <Button variant={"ghost"} className='h-8 w-8' onClick={handleEditClick} size={"icon"}>
                                    <Edit size={16} />
                                </Button>}
                            </div>

                            <div className="flex items-center gap-2 text-sm opacity-70">
                                <Briefcase size={16} />
                                <span className='capitalise'>{user?.role}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio section */}
                {user.role === "jobseeker" && user.bio && (
                    <div className="mt-6 m-2 p-4 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium opacity-70">
                            <FileText size={16} />
                            <span>About</span>
                        </div>
                        <p className="text-base leading-relaxed">{user.bio}</p>
                    </div>
                )}

                {/* Contact Info */}
                <div className="mt-8 mx-2">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Mail size={20} className="text-blue-600" />
                        Contact Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <Mail size={18} className='text-blue-600' />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs opacity-70 font-medium">Email</p>
                                <p className="text-sm truncate">{user?.email}</p>

                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <Phone size={18} className='text-blue-600' />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs opacity-70 font-medium">Phone</p>
                                <p className="text-sm truncate">{user?.phone_number}</p>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Resume Section */}
                {user.role === "jobseeker" && user.resume && (
                    <div className="mt-8 mx-2">
                        <h2 className="text-lg font-semibold mt-4 flex items-center gap-2">
                            <NotepadText size={20} className="text-blue-600" />
                            Resume
                        </h2>

                        <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors">
                            <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                <NotepadText size={20} className="text-red-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    Resume Document
                                </p>
                                <Link href={user?.resume} className='text-sm text-blue-500 hover:underline' target='_blank'>
                                    View Resume PDF
                                </Link>
                            </div>
                            <Button variant={"outline"} size={'sm'} onClick={handleResumeClick} className='gap-2'>Update</Button>
                            <input type="file" ref={resumeRef} className='hidden' accept='application/pdf' onChange={changeResume} />
                            {/* Edit Resume */}
                            {

                                isYourAccount && <>
                                    <Button variant={"secondary"} size={"icon"} onClick={handleClick} className='absolute bottom-96 right-[65rem]  rounded-full h-10 w-10 shadow-lg'>
                                        <Camera size={18} />

                                    </Button>
                                    <input type="file" className='hidden' accept='image/*' ref={inputRef} onChange={changeHandler} />
                                </>
                            }
                        </div>
                    </div>
                )}

                {/* Subscription */}
                {user?.role === "jobseeker" && (
                    <div>
                        <h2 className="text-lg font-semibold mt-8 mx-2 flex items-center gap-2">
                            <Briefcase size={20} className="text-blue-600" />
                            Subscription
                        </h2>
                        <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 transition-colors mx-2">
                            <div className="flex-1">
                                <p className="text-sm font-medium">
                                    {user?.subscription ? "You are subscribed to Premium Plan" : "You are on Free Plan"}
                                </p>
                                <p className="text-xs opacity-70">
                                    {user?.subscription ? "Enjoy unlimited job applications and exclusive features with Premium." : "Upgrade to Premium for unlimited applications and exclusive features."}
                                </p>
                            </div>
                            <Link href={"/subscribe"}>Subscribe</Link>
                    </div>
                    </div>
    )
}


            </Card >
    {/* Dialog box for edit */ }
    < Dialog >
                <DialogTrigger asChild>
                    <Button ref={editRef} variant={"outline"} className='hidden'>Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Edit profile</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5 py-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium flex items-center gap-2"
                            >
                                <UserIcon size={16} /> Full Name
                            </Label>
                            <Input id='name' type='text' placeholder='Enter your name...' className='h-11' value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="phone"
                                className="text-sm font-medium flex items-center gap-2"
                            >
                                <Phone size={16} /> Phone
                            </Label>
                            <Input id='phone' type='text' placeholder='Enter your phone number...' className='h-11' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                    </div>
                    {
                        user?.role === "jobseeker" && <>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="bio"
                                    className="text-sm font-medium flex items-center gap-2"
                                >
                                    <FileText size={16} /> Bio
                                </Label>
                                <Input id='bio' type='text' placeholder='Enter your bio...' className='h-11' value={bio} onChange={(e) => setBio(e.target.value)} />
                            </div>
                        </>
                    }
                    <DialogFooter>
                        <Button disabled={btnLoading} onClick={updateProfileHandler} className='w-full h-11' type='submit'>{btnLoading ? "Saving Changes..." : "Save Changes"}</Button>
                    </DialogFooter>
                </DialogContent>

            </Dialog >
        </div >
    )
}

export default Info