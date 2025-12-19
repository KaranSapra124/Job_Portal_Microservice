"use client"
import { job_service, useAppData } from '@/context/appContext'
import React, { useEffect, useRef, useState } from 'react'
import Cookies from "js-cookie"
import axios from 'axios'
import toast from 'react-hot-toast'
import Loading from '@/components/ui/loading'
import { Briefcase, Building2, Eye, FileText, Globe, Image, Notebook, Plus, Trash } from 'lucide-react'
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
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message);
            setCompanies(data?.companies)
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
        finally {
            setBtnLoading(false)
        }
    }
    async function addCompany() {
        if (!name || !website || !description || !logo) {
            return alert("Please provide all details!")
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("website", website);
        formData.append("file", logo)
        setBtnLoading(true)
        try {
            const { data } = await axios.post(`${job_service}/api/job/company/add`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message);
            clearData()
            getCompanies()
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
        finally {
            setBtnLoading(false)
        }
    }
    async function deleteCompany(companyId: string) {
        if(!confirm("Do you want to delete this company?")){
            return;
        }
        setBtnLoading(true)
        try {
            const { data } = await axios.delete(`${job_service}/api/job/company/${companyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message);
            getCompanies()
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
        finally {
            setBtnLoading(false)
        }
    }
    useEffect(() => {
        getCompanies()
    }, [])
    if (loading) return <Loading />
    return (
        <>
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Card className="shadow-lg border-2 overflow-hidden">
                    <div className="bg-blue-500 p-6 border-b">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <Building2 size={20} className="text-blue-600" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl">My Companies</CardTitle>
                            <CardDescription className='text-sm mt-1 text-white'>
                                Manage your registered companies ({companies?.length})
                            </CardDescription>
                            {
                                companies?.length < 3 && <>
                                    <Button onClick={openDialog} className='gap-2'>
                                        <Plus size={18} />
                                        Add Company
                                    </Button>
                                </>
                            }
                        </div>
                    </div>

                    {/* Companies */}

                    <div className="p-6">
                        {companies.length > 0 ? (
                            <div className="grid gap-4">
                                {companies?.map((c) => (
                                    <div
                                        key={c.company_id}
                                        className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-blue-500 transition-all bg-background"
                                    >
                                        <div className="h-16 w-16 rounded-full boder-2 overflow-hidden shrink-0 bg-background">
                                            <img src={c.logo} alt='' className='w-full h-full object-cover' />
                                        </div>
                                        {/* // Company Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-lg mb-1 truncate">
                                                {c.name}
                                            </h3>
                                            <p className="text-sm opacity-70 line-clamp-2 mb-2">
                                                {c.description}
                                            </p>
                                            <a
                                                href={c?.website}
                                                target="_blank"
                                                className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                                            >
                                                <Globe size={12} />
                                                {c?.website}
                                            </a>
                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Link href={`/company/${c?.company_id}`}>
                                                    <Button variant={'outline'} size={'icon'} className='h-9 w-9'>
                                                        <Eye size={16} />
                                                    </Button>
                                                </Link>
                                                <Button onClick={() => deleteCompany(c.company_id)} variant={'destructive'} size={'icon'} className='h-9 w-9'>
                                                    <Trash size={16} />
                                                </Button>

                                            </div>
                                        </div>

                                    </div>

                                ))}
                            </div>
                        ) : (
                            <>
                                <div className='text-center py-12'>
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                        <Building2 size={32} className='opacity-40' />
                                    </div>
                                    <h2 className='text-center font-bold'>No Companies Added Yet!</h2>
                                </div>
                            </>
                        )}
                    </div>

                </Card>


                {/* Add Company */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="hidden" ref={addRef}></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl flex items-center gap-2">
                                <Building2 className="text-blue-600" />
                                Add New Company
                            </DialogTitle>
                        </DialogHeader>
                        <div className='flex space-y-2 flex-col'>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium flex items-center gap-2"
                                >
                                    <Briefcase size={16} /> Company Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter company name"
                                    className="h-11"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-medium flex items-center gap-2"
                                >
                                    <Notebook size={16} /> Company Description
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter company description..."
                                    className="h-11"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="website"
                                    className="text-sm font-medium flex items-center gap-2"
                                >
                                    <Globe size={16} /> Company Website
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Add Website URL..."
                                    className="h-11"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="logo"
                                    className="text-sm font-medium flex items-center gap-2"
                                >
                                    <Image size={16} /> Company Logo
                                </Label>
                                <Input
                                    id="logo"
                                    accept='image/'
                                    type="file"
                                    className="h-11"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogo(e.target.files?.[0] || null)}
                                />
                            </div>

                        </div>
                        <DialogFooter>
                            <Button disabled={btnLoading} onClick={addCompany} className='w-full h-11'>
                                {btnLoading ? "Adding Company..." : "Add Company"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>





            </div>

        </>
    )
}

export default Company