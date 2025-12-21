"use client"
import { job_service, useAppData } from '@/context/appContext';
import { Company, Job } from '@/type';
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Cookies from "js-cookie"
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardSim, Pen, PlusCircle, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';

const CompanyPage = () => {
    const token = Cookies.get("token")
    const { user } = useAppData()
    const { id } = useParams();
    const company_id = id
    const [comapnyDetail, setCompanyDetail] = useState<Company | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)

    const [jobDetail, setJobDetail] = useState<Job | null>({
        description: "",
        is_active: true,
        job_type: 'Full-time',
        location: '',
        openings: 1,
        // @ts-expect-error
        posted_by_recruiter_id: user?.user_id,
        role: '',
        salary: 0,
        title: '',
        work_location: 'On-site',
        // @ts-expect-error
        company_id: company_id

    })
    const addJobHandler = () => {
        setJobDetail({
            description: "",
            is_active: true,
            job_type: 'Full-time',
            location: '',
            openings: 1,
            // @ts-expect-error
            posted_by_recruiter_id: user?.user_id,
            role: '',
            salary: 0,
            title: '',
            work_location: 'On-site',
            // @ts-expect-error
            company_id: company_id

        })
        setIsUpdate(false)
        setIsModalOpen(true)
    }
    const updateJobHandler = (item: Job) => {
        setIsUpdate(true)
        setIsModalOpen(true);
        setJobDetail(item)
    }
    const fetchCompany = async () => {
        try {
            const { data } = await axios.get(`${job_service}/api/job/company/get-company/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message)
            setCompanyDetail(data?.companyDetail)
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
    }

    // Job Functions

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // @ts-expect-error 
        setJobDetail((prev) => ({
            ...prev,
            [name]: value
        }))
    }


    const addJobFn = async () => {
        try {
            const { data } = await axios.post(`${job_service}/api/job/company/add-job`, jobDetail, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message);
            fetchCompany()
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
    }
    const updateJobFn = async () => {
        //@ts-expect-error
        const payload = { ...jobDetail, openings: +jobDetail?.openings }
        try {
            const { data } = await axios.put(`${job_service}/api/job/company/update-job/${jobDetail?.job_id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message);
            fetchCompany();
            setIsModalOpen(false);
            setIsUpdate(false)
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
    }
    
    //  const deleteJobFn = async () => {

    //    if(!confirm(`Do You want to delete this job ?`)){
    //     return;
    //    }
    //     try {
    //         const { data } = await axios.put(`${job_service}/api/job/company/update-job/${jobDetail?.job_id}`, payload, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //         toast.success(data?.message);
    //         fetchCompany();
    //         setIsModalOpen(false);
    //         setIsUpdate(false)
    //     } catch (error: any) {
    //         toast.error(error?.response?.data?.message)
    //     }
    // }

    const isRecruiter = user && comapnyDetail && user?.user_id === comapnyDetail?.recruiter_id;
    useEffect(() => {
        fetchCompany()
    }, [id])





    return (
        <>
            {/* Add Job Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                {/* <DialogTrigger asChild>
                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                        <PlusCircle className="w-4 h-4" />
                        Post a New Job
                    </Button>
                </DialogTrigger> */}
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Create Job Opening</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to post a new position for {comapnyDetail?.name}.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={(e: React.FormEvent) => {
                        e.preventDefault();
                        isUpdate ? updateJobFn() : addJobFn()
                    }} className="space-y-6 py-4">
                        {/* Job Title & Role */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title</Label>
                                <Input id="title" value={jobDetail?.title} onChange={handleChange} name="title" placeholder="e.g. Senior Frontend Engineer" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role / Category</Label>
                                <Input id="role" value={jobDetail?.role} onChange={handleChange} name="role" placeholder="e.g. Engineering" required />
                            </div>
                        </div>

                        {/* Job Description (Standard HTML Textarea) */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description</Label>
                            <textarea onChange={handleChange}
                                id="description"
                                value={jobDetail?.description}
                                name="description"
                                placeholder="Describe the responsibilities and requirements..."
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                        </div>

                        {/* Salary & Openings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="salary">Annual Salary (Optional)</Label>
                                <Input value={jobDetail?.salary?.toString()} onChange={handleChange} id="salary" name="salary" type="number" placeholder="e.g. 80000" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="openings">Number of Openings</Label>
                                <Input value={jobDetail?.openings} onChange={handleChange} id="openings" name="openings" type="number" defaultValue={1} min={1} required />
                            </div>
                        </div>

                        {/* Type & Location Mode (Standard HTML Select) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="job_type">Job Type</Label>
                                <select onChange={handleChange}
                                    id="job_type"
                                    name="job_type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                    value={jobDetail?.job_type}
                                >
                                    <option value="">Select type</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="work_location">Work Location</Label>
                                <select onChange={handleChange}
                                    id="work_location"
                                    value={jobDetail?.work_location}
                                    name="work_location"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="">Select mode</option>
                                    <option value="Onsite">On-site</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="Remote">Remote</option>
                                </select>
                            </div>
                        </div>

                        {/* Specific Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location">City / Office Location</Label>
                            <Input onChange={handleChange} value={jobDetail?.location?.toString()} id="location" name="location" placeholder="e.g. San Francisco, CA or Remote" />
                        </div>

                        {/* Job Status */}
                        <div className="space-y-2">
                            <Label htmlFor="status">{jobDetail?.is_active ? "Active" : "In Active"}</Label>
                            <Switch onCheckedChange={() => {
                                //@ts-expect-error
                                setJobDetail((prev) => ({
                                    ...prev,
                                    is_active: prev?.is_active ? false : true
                                }))
                            }} name='is_active' checked={jobDetail?.is_active} />
                        </div>

                        <DialogFooter className="pt-4 gap-2">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setIsUpdate(false);
                                    setJobDetail({
                                        description: "",
                                        is_active: true,
                                        job_type: 'Full-time',
                                        location: '',
                                        openings: 1,
                                        // @ts-expect-error
                                        posted_by_recruiter_id: user?.user_id,
                                        role: '',
                                        salary: 0,
                                        title: '',
                                        work_location: 'On-site',
                                        // @ts-expect-error
                                        company_id: company_id

                                    })
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                {isUpdate ? "Update Job" : "Post Job Opening"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="max-w-5xl mx-auto p-6 min-h-screen bg-gray-50">
                {!comapnyDetail ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-gray-500 animate-pulse">Loading company details...</p>
                    </div>
                ) : isRecruiter && comapnyDetail ?
                    <div className="space-y-8">
                        {/* Header Section */}
                        <header className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center gap-6">
                            <div className="w-32 h-32 shrink-0 bg-gray-100 rounded-lg overflow-hidden border">
                                <img
                                    src={comapnyDetail.logo}
                                    alt={`${comapnyDetail.name} logo`}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-900">{comapnyDetail.name}</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Member since {new Date(comapnyDetail.created_at).toLocaleDateString()}
                                </p>
                                {comapnyDetail.website && (
                                    <a
                                        href={comapnyDetail.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Visit Website
                                    </a>
                                )}
                            </div>
                        </header>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">About the Company</h2>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                        {comapnyDetail.description}
                                    </p>
                                </section>

                                {/* Jobs Section */}
                                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className='flex justify-between items-center'>
                                        <h2 className="text-xl font-semibold mb-4 text-gray-800" >Open Positions</h2>
                                        <Button variant={"outline"} className='bg-black rounded-md text-white hover:text-black cursor-pointer' onClick={addJobHandler}>Add Position +</Button>
                                    </div>
                                    {comapnyDetail.jobs && comapnyDetail.jobs.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {comapnyDetail.jobs.map((j: any) => (
                                                <div
                                                    key={j.job_id}
                                                    className="group relative flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-400 transition-all cursor-pointer"
                                                >
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                {j.title}
                                                            </h3>
                                                            {j.is_active && (
                                                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700 bg-green-100 rounded-full">
                                                                    Active
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-500">
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                                {j.job_type}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                                                {j.work_location}
                                                            </span>
                                                            <span className="text-gray-400">|</span>
                                                            <span>{j.location || "Remote"}</span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex items-center gap-2 md:mt-0 text-left md:text-right border-t md:border-t-0 pt-3 md:pt-0">
                                                        <div>
                                                            <p className="font-bold text-gray-900">
                                                                {j.salary ? `₹${j.salary.toLocaleString()}` : "Salary Undisclosed"}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                Posted {new Date(j.created_at).toLocaleDateString(undefined, {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className='flex gap-1'>
                                                            <Link href={`/company/jobs/${j.job_id}`} className='p-2 shadow rounded'><CardSim size={20} /></Link>
                                                            <Button variant={"default"} onClick={() => updateJobHandler(j)}><Pen size={8} /></Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                            <p className="text-gray-400 font-medium">No job openings are currently listed.</p>
                                            <p className="text-sm text-gray-400">Click the 'Add Job' button to get started.</p>
                                        </div>
                                    )}
                                </section>
                            </div>

                            {/* Sidebar / Quick Info */}
                            <div className="space-y-6">
                                <aside className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Company Details</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-gray-400 block">Company ID</label>
                                            <span className="text-sm font-mono text-gray-700">{comapnyDetail.company_id}</span>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 block">Recruiter ID</label>
                                            <span className="text-sm text-gray-700">#{comapnyDetail.recruiter_id}</span>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </div>
                    </div>
                    : <h1>You are forbidden to access this page.</h1>}
            </div>


        </>
    );
}

export default CompanyPage