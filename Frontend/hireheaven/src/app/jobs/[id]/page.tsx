"use client"
import { job_service, useAppData } from '@/context/appContext'
import { Job } from '@/type'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import Cookies from "js-cookie"
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
    Calendar,
    MapPin,
    Briefcase,
    IndianRupee,
    Users,
    Building2,
    Clock,
    CheckCircle,
    ArrowLeft,
    Share2,
    Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Loading from '@/components/ui/loading'

const JobsPage = () => {
    const token = Cookies.get("token");
    const { applications, applyForJob } = useAppData()
    const { id } = useParams();
    const router = useRouter();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    const getJobFn = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${job_service}/api/job/company/get-job/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Based on your previous snippet, data might be the job object directly
            setJob(data);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load job details");
        } finally {
            setLoading(false);
        }
    };
    const isAlreadyApplied = (jobId: number) => {
        return applications && applications?.length > 0 && applications?.some((j) => {
            return j.job_id === jobId
        })
    }

    useEffect(() => {
        if (id) getJobFn();
    }, [id]);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <h2 className="text-xl font-bold text-gray-800">Job Not Found</h2>
                <p className="text-gray-500 mb-6 text-center">The job you are looking for might have been closed or removed.</p>
                <Button onClick={() => router.back()} variant="outline">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Top Navigation Bar */}
            {/* <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
                    >
                        <ArrowLeft size={18} />
                        Back to Jobs
                    </button>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="text-gray-500"><Share2 size={20} /></Button>
                        <Button variant="ghost" size="icon" className="text-gray-500"><Bookmark size={20} /></Button>
                    </div>
                </div>
            </div> */}

            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 pt-10 pb-10">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider">
                                <CheckCircle size={14} />
                                {job.is_active ? "Actively Hiring" : "Closed"}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                                {job.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Building2 size={20} className="text-blue-500" />
                                    <span className="font-semibold text-gray-800">Company ID: {job.company_id}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={20} className="text-red-500" />
                                    <span className="font-medium">{job.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={20} className="text-orange-500" />
                                    <span className="font-medium">
                                        Posted {new Date(job.created_at || '').toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-auto">
                            <Button onClick={async () => {

                                if (job?.job_id && !isAlreadyApplied(job?.job_id)) {

                                    await applyForJob(job.job_id)
                                } else {
                                    toast.error("You have already applied to it!")
                                }
                            }} disabled={isAlreadyApplied(job.job_id as number) as boolean} size="lg" className={`${isAlreadyApplied(job?.job_id as number) ? "w-full md:w-auto bg-gray-200 hover:bg-gray-500 text-black cursor-not-allowed px-12 h-14 text-lg font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95" : "w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-12 h-14 text-lg font-bold rounded-2xl shadow-xl shadow-blue-100 transition-all active:scale-95"}`}>
                                {isAlreadyApplied(job?.job_id as number) ? "Already Applied" : "Apply Now"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Side: Job Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Role</h2>
                            <div className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                {job.description}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Responsibility</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                                {[
                                    "Work with multidisciplinary teams",
                                    "Design scalable solutions",
                                    "Commit to hybrid work culture",
                                    "Collaborate on development"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-blue-600" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right Side: Information Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                            <h3 className="font-bold text-gray-900 text-xl mb-8 border-b pb-4">Job Summary</h3>

                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                                        <IndianRupee size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Annual Salary</p>
                                        <p className="font-extrabold text-gray-900 text-lg">
                                            ₹{parseFloat(job?.salary?.toString() || '0').toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Job Type</p>
                                        <p className="font-extrabold text-gray-900 text-lg">{job.job_type}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Openings</p>
                                        <p className="font-extrabold text-gray-900 text-lg">
                                            {Math.floor(Number(job.openings))} Position(s)
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Setup</p>
                                        <p className="font-extrabold text-gray-900 text-lg">{job.work_location}</p>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-8 border-gray-100" />

                            <div className="bg-gray-50 p-6 rounded-2xl">
                                <h4 className="font-bold text-gray-900 mb-2">Recruiter Info</h4>
                                <p className="text-sm text-gray-500 leading-tight">
                                    ID: #{job.posted_by_recruiter_id} <br />
                                    Authorized hiring partner
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobsPage;