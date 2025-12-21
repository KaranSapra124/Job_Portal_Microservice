"use client"
import { job_service } from '@/context/appContext';
import { Application } from '@/type';
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie"
import toast from 'react-hot-toast';
import { Clock, FileText, IndianRupee, Mail, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobApplications = () => {
    const jobStatus: string[] = [
        "Submitted",
        "Hired",
        "Rejected"
    ]
    const token = Cookies.get("token")
    const [loading, setLoading] = useState(false)
    const [appId, setAppId] = useState(null)
    const { id } = useParams();
    const [jobApps, setJobApps] = useState<Application[] | null>(null)
    const [status, setStatus] = useState<string>('')
    const getJobApplications = async () => {
        setLoading(true)
        try {

            const { data } = await axios.get(`${job_service}/api/job/company/get-applications/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message || "Job Applications Fetched!")
            setJobApps(data)
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }
    // Update Job Application
    const updateJobApplications = async (id:number,status:string) => {
        setLoading(true)
        try {

            const { data } = await axios.put(`${job_service}/api/job/company/update-application/${id}`, { status: status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message || "Job Applications Updated!")
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        getJobApplications()
    }, [])
    return (
        <>
            <div className="min-h-screen bg-gray-50/50 pb-12">
                {/* Header Section */}
                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            {jobApps?.[0]?.job_title || "Job Applications"}
                        </h1>

                        <span className="text-blue-600 font-bold">#{jobApps?.length || 0} Total Applications</span>
                    </div>
                </div>

                {/* Table Section */}
                <main className="max-w-7xl mx-auto px-4 mt-8">
                    {jobApps && jobApps.length > 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Application ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Applicant Email</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Applied Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Resume</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {jobApps.map((app) => (
                                        <tr key={app.application_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-5 text-sm font-bold text-gray-900">
                                                #{app.application_id}
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                                                {app.applicant_email}
                                            </td>
                                            <td className="px-6 py-5 text-sm text-gray-500">
                                                {new Date(app.applied_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider bg-gray-100 text-gray-700">
                                                    <select
                                                        className="bg-transparent outline-none cursor-pointer font-bold uppercase tracking-wider text-[11px]"
                                                        onChange={async (e) => {
                                                            // Handle your status update logic here
                                                          
                                                            await updateJobApplications(app?.application_id,e.target.value)
                                                        }}
                                                    >
                                                        {jobStatus.map((status) => (
                                                            <option key={status} value={status}>
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <a
                                                    href={app.resume}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <FileText size={16} className="mr-1.5" />
                                                    View Resume
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-white p-20 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                            <p className="text-gray-400 font-medium">No applications found for this job.</p>
                        </div>
                    )}
                </main>
            </div>
        </>
    )
}

export default JobApplications