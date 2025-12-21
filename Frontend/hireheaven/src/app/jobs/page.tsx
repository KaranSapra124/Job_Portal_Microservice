"use client"
import { job_service, useAppData } from '@/context/appContext'
import { Job } from '@/type'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Cookies from "js-cookie"

const JobPage = () => {
    const token = Cookies.get("token");
    const { applyForJob, applications, getJobApplications } = useAppData()
    const location: string[] = [
        "Delhi", "Mumbai", "Bangalore", "Pune", "Remote"
    ]
    const [jobs, setJobs] = useState<Job[] | null>(null);



    const getJobFn = async () => {

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
        }
    }

    const isAlredyApplied = (jobId: number) => {
        return applications && applications?.length > 0 && applications?.some((j) => {
            return j.job_id === jobId
        })
    }

    useEffect(() => {
        getJobFn()

    }, [])




    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Header Area */}
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore Opportunities</h1>
                    <p className="text-gray-500 mt-1">Find your next career move from top companies.</p>
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
    );
}

export default JobPage