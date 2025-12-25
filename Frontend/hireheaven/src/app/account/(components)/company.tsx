"use client"
import { job_service, useAppData } from '@/context/appContext'
import React, { useEffect, useRef, useState } from 'react'
import Cookies from "js-cookie"
import axios from 'axios'
import toast from 'react-hot-toast'
import Loading from '@/components/ui/loading'
import { Briefcase, Building2, Eye, Globe, Image as ImageIcon, Notebook, Plus, Trash, ExternalLink } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Company as CompanyType } from '@/type'
import Link from 'next/link'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

const Company = () => {
    const { loading } = useAppData();
    const addRef = useRef<HTMLButtonElement | null>(null);
    const [name, setName] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [website, setWebsite] = useState("")
    const [description, setDescription] = useState("")
    const [companies, setCompanies] = useState<CompanyType[]>([])
    const [btnLoading, setBtnLoading] = useState(false)
    const token = Cookies.get("token")

    const clearData = () => {
        setName(""),
        setDescription("")
        setLogo(null)
        setWebsite("")
    }

    const openDialog = () => {
        addRef.current?.click();
    }

    async function getCompanies() {
        setBtnLoading(true)
        try {
            const { data } = await axios.get(`${job_service}/api/job/company/get-companies`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCompanies(data?.companies || [])
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        } finally {
            setBtnLoading(false)
        }
    }

    async function addCompany() {
        if (!name || !website || !description || !logo) {
            return toast.error("Please provide all details!")
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("website", website);
        formData.append("file", logo)
        setBtnLoading(true)
        try {
            const { data } = await axios.post(`${job_service}/api/job/company/add`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(data?.message);
            clearData()
            getCompanies()
            // Close dialog logic usually goes here via a state if needed
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        } finally {
            setBtnLoading(false)
        }
    }

    async function deleteCompany(companyId: string) {
        if(!confirm("Do you want to delete this company?")) return;
        setBtnLoading(true)
        try {
            const { data } = await axios.delete(`${job_service}/api/job/company/${companyId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success(data?.message);
            getCompanies()
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        } finally {
            setBtnLoading(false)
        }
    }

    useEffect(() => {
        getCompanies()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <div>
                    <h1 className="text-xl md:text-3xl font-black text-blue-700 tracking-tight">Company Manager</h1>
                    <p className="text-gray-500 font-bold text-xs">Register and manage up to 3 organizations ({companies?.length}/3)</p>
                </div>
                {companies?.length < 3 && (
                    <Button onClick={openDialog} className="rounded-xl h-8 md:h-12 px-6 font-bold gap-2">
                        <Plus size={18} /> Add New Company
                    </Button>
                )}
            </div>

            {/* Main Card Wrapper */}
            <Card className="shadow-2xl shadow-gray-200/50 border-none rounded overflow-hidden">
                <div className="bg-blue-600 p-8 text-white">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <Building2 size={16} className="text-white" />
                        </div>
                        <div>
                            <CardTitle className="text-xl md:text-2xl font-bold">My Organizations</CardTitle>
                            <CardDescription className="text-blue-100 text-xs font-medium">
                                Active profiles currently registered under your account
                            </CardDescription>
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    {companies.length > 0 ? (
                        <div className="grid  lg:grid-cols-2 gap-6">
                            {companies.map((c) => (
                                <div 
                                    key={c.company_id}
                                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-3xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                                >
                                    {/* Logo */}
                                    <div className="h-20 w-20 rounded-2xl border-2 border-white overflow-hidden shrink-0 shadow-sm bg-white">
                                        <img src={c.logo} alt={c.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <h3 className="font-black text-xl text-gray-900 truncate">{c.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 font-medium leading-relaxed">
                                            {c.description}
                                        </p>
                                        <a 
                                            href={c.website} 
                                            target="_blank" 
                                            className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                                        >
                                            <Globe size={14} /> {c?.website?.replace('https://', '')}
                                        </a>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                                        <Link href={`/company/${c.company_id}`} className="flex-1 sm:flex-none">
                                            <Button variant="outline" size="icon" className="w-full sm:w-10 h-10 rounded-xl hover:text-blue-600 hover:border-blue-200">
                                                <Eye size={18} />
                                            </Button>
                                        </Link>
                                        <Button 
                                            onClick={() => deleteCompany(c.company_id)} 
                                            variant="destructive" 
                                            size="icon" 
                                            className="flex-1 sm:flex-none w-full sm:w-10 h-10 rounded-xl"
                                        >
                                            <Trash size={18} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-6 text-gray-300">
                                <Building2 size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900">No Companies Found</h2>
                            <p className="text-gray-500 font-medium mt-2 max-w-xs mx-auto mb-8">
                                Start by adding your company profile to post jobs and find talent.
                            </p>
                            <Button onClick={openDialog} variant="outline" className="rounded-xl px-8 font-bold">
                                Create Your First Profile
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* Add Company Dialog */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="hidden" ref={addRef}></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="bg-slate-900 p-8 text-white">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <Plus className="text-blue-400" /> Register Organization
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="p-8 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Name</Label>
                                <Input 
                                    placeholder="Company Name" 
                                    className="h-12 rounded-xl border-gray-100 bg-gray-50 font-medium" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Website</Label>
                                <Input 
                                    placeholder="https://..." 
                                    className="h-12 rounded-xl border-gray-100 bg-gray-50 font-medium" 
                                    value={website} 
                                    onChange={(e) => setWebsite(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Logo</Label>
                            <Input 
                                type="file" 
                                accept="image/*"
                                className="h-12 rounded-xl border-gray-100 bg-gray-50 pt-2.5 cursor-pointer" 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogo(e.target.files?.[0] || null)} 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Description</Label>
                            <Input 
                                placeholder="What does your company do?" 
                                className="h-12 rounded-xl border-gray-100 bg-gray-50 font-medium" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-8 pt-0">
                        <Button 
                            disabled={btnLoading} 
                            onClick={addCompany} 
                            className="w-full h-14 rounded-2xl font-black text-lg bg-blue-600 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
                        >
                            {btnLoading ? "Processing..." : "Confirm Registration"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Company