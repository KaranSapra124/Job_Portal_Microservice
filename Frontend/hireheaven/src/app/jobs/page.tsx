"use client"
import { job_service, useAppData } from '@/context/appContext'
import { Job } from '@/type'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Cookies from "js-cookie"
import { Button } from '@/components/ui/button'
import { Filter, X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Loading from '@/components/ui/loading'
import Link from 'next/link'

const JobPage = () => {
    const token = Cookies.get("token");
    const [filters, setFilters] = useState({ location: "", title: "" })
    const [loading, setLoading] = useState(false)
    const { applyForJob, applications, getJobApplications } = useAppData()
    const location: string[] = [
        "Delhi", "Mumbai", "Bangalore", "Pune", "Remote"
    ]
    const [jobs, setJobs] = useState<Job[] | null>(null);
    const [filterModal, setFilterModal] = useState(false)


    const getJobFn = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post(`${job_service}/api/job/company/get-active-jobs`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message);
            setJobs(data)

        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }



    const isAlredyApplied = (jobId: number) => {
        return applications && applications?.length > 0 && applications?.some((j) => {
            return j.job_id === jobId
        })
    }

    const filterJobs = async () => {
        const filteredJobs = jobs?.filter((item) => {
            return item?.title === filters?.title || item?.location === filters?.location
        }) || null
        setJobs(filteredJobs)

    }



    useEffect(() => {
        getJobFn()
    }, [])

    useEffect(() => {
        if (filters?.title?.length === 0 && filters?.location?.length === 0) {
            getJobFn()
        }
    }, [filters])








    return (
        <>
            {loading ? <Loading /> : <>
                <Dialog open={filterModal} onOpenChange={setFilterModal}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Filter Jobs</DialogTitle>
                            <DialogDescription>
                                Narrow down your search results by title or city.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Search by Job Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title-filter" className="text-sm font-semibold text-gray-700">
                                    Search Job Title
                                </Label>
                                <div className="relative">
                                    <Input onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        setFilters((prev: { title: string, location: string }) => ({ ...prev, title: e.target.value }))

                                    }}
                                        id="title-filter"
                                        placeholder="e.g. Frontend Developer"
                                        className="pl-3"
                                    // onChange={(e) => setTitleSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Select by Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location-filter" className="text-sm font-semibold text-gray-700">
                                    Location
                                </Label>
                                <select
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setFilters((prev: { title: string, location: string }) => ({ ...prev, title: e.target.value }))

                                    }}
                                    id="location-filter"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                                // onChange={(e) => setSelectedLocation(e.target.value)}
                                >
                                    <option value="">All Locations</option>
                                    {location.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <DialogFooter className="flex flex-row gap-2 sm:justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setFilterModal(false)}
                                className="flex-1 sm:flex-none"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    filterJobs()
                                    // Trigger your filter logic here
                                    setFilterModal(false);

                                }}
                                className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                            >
                                Apply Filters
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>


                <div className="min-h-screen bg-gray-50/50">
                    <div className="max-w-7xl mx-auto px-4 py-8">

                        {/* Header Area */}
                        <div className="mb-8">
                            <div className='flex justify-between items-center'>
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore Opportunities</h1>
                                <Button onClick={() => setFilterModal(true)}>Filters <Filter /></Button>
                            </div>
                            <p className="text-gray-500 mt-1">Find your next career move from top companies.</p>
                            {(filters?.title || filters?.location) && (
                                <div className="flex flex-wrap items-center gap-3 mb-6 animate-in fade-in slide-in-from-top-1">
                                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                        Active Filters:
                                    </h2>

                                    <div className="flex flex-wrap gap-2">
                                        {/* Title Badge */}
                                        {filters?.title && (
                                            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-sm font-semibold text-blue-700 shadow-sm transition-all hover:bg-blue-100">
                                                <span>Title: {filters.title}</span>
                                                <button
                                                    onClick={() => {
                                                        setFilters((prev) => ({ ...prev, title: "" }))
                                                        filterJobs()
                                                    }}
                                                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                                    aria-label="Remove title filter"
                                                >
                                                    <X size={14} strokeWidth={3} />
                                                </button>
                                            </div>
                                        )}

                                        {/* Location Badge */}
                                        {filters?.location && (
                                            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full text-sm font-semibold text-indigo-700 shadow-sm transition-all hover:bg-indigo-100">
                                                <span>Location: {filters.location}</span>
                                                <button
                                                    onClick={() => {
                                                        setFilters((prev) => ({ ...prev, location: "" }))
                                                        filterJobs()
                                                    }}
                                                    className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                                                    aria-label="Remove location filter"
                                                >
                                                    <X size={14} strokeWidth={3} />
                                                </button>
                                            </div>
                                        )}

                                        {/* Clear All Button */}
                                        {(filters?.title && filters?.location) && (
                                            <button
                                                onClick={() => setFilters({ title: "", location: "" })}
                                                className="text-xs font-bold text-gray-400 hover:text-red-500 underline underline-offset-4 ml-2 transition-colors"
                                            >
                                                Clear All
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col lg:flex-row gap-8">

                            {/* Left Sidebar: Filters */}
                            <aside className="w-full lg:w-64 space-y-6">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-4">Location</h3>
                                    <div className="space-y-3">
                                        {location.map((loc) => (
                                            <label key={loc} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{loc}</span>
                                            </label>
                                        ))}
                                    </div>

                                    <hr className="my-6 border-gray-100" />

                                    <h3 className="font-bold text-gray-900 mb-4">Job Type</h3>
                                    <div className="space-y-3">
                                        {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-100">
                                    <h4 className="font-bold text-lg mb-2">Job Alerts</h4>
                                    <p className="text-blue-100 text-xs leading-relaxed mb-4">
                                        Get notified immediately when new jobs match your profile.
                                    </p>
                                    <button className="w-full py-2 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
                                        Enable Alerts
                                    </button>
                                </div>
                            </aside>

                            {/* Right Content: Job Feed */}
                            <main className="flex-1">
                                {!jobs ? (
                                    <div className="flex justify-center py-20">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                                    </div>
                                ) : jobs.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {jobs.map((job) => (
                                            <div
                                                key={job.job_id}
                                                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex gap-4">
                                                        {/* Company Logo */}
                                                        <div className="h-14 w-14 rounded-xl border border-gray-100 flex-shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center">
                                                            {job.company_logo ? (
                                                                <img src={job.company_logo} alt="Logo" className="h-full w-full object-cover" />
                                                            ) : (
                                                                <span className="text-gray-400 font-bold text-xl">{job.title.charAt(0)}</span>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                                                                {job.title}
                                                            </h2>
                                                            <p className="text-sm font-medium text-gray-500 mb-3">{job.role}</p>

                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                                                                    {job.job_type}
                                                                </span>
                                                                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">
                                                                    {job.work_location}
                                                                </span>
                                                                <span className="text-gray-400 text-xs flex items-center gap-1">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                                    {job.location}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-right flex flex-col items-end gap-3">
                                                        <p className="font-bold text-gray-900">
                                                            {job.salary ? `₹${job.salary.toLocaleString()}` : "Not Disclosed"}
                                                        </p>
                                                        <button onClick={async () => {

                                                            if (job?.job_id && !isAlredyApplied(job?.job_id)) {

                                                                await applyForJob(job.job_id)
                                                                await getJobApplications()
                                                            } else {
                                                                toast.error("You have already applied to it!")
                                                            }
                                                        }} disabled={isAlredyApplied(job.job_id as number) as boolean} className={`${isAlredyApplied(job?.job_id as number) ? "px-5 py-2 bg-gray-200 text-gray-900 text-sm font-bold rounded-xl hover:bg-gray-300 cursor-not-allowed transition-colors" : "px-5 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-colors"}`}>
                                                            {isAlredyApplied(job.job_id as number) ? "Already Applied" : " Apply Now"}
                                                        </button>
                                                        <Link href={`/jobs/${job?.job_id}`} className="px-5 py-2 bg-blue-900 text-gray-100 text-sm font-bold rounded-xl hover:bg-gray-300  transition-colors">
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* Description Preview */}
                                                <p className="mt-4 text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                                    {job.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                        <p className="text-gray-400">No active jobs found for your criteria.</p>
                                    </div>
                                )}
                            </main>
                        </div>
                    </div>
                </div>
            </>}
        </>
    );
}

export default JobPage