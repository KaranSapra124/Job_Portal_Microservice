"use client"
import { useAppData } from '@/context/appContext'
import React from 'react'
import Link from 'next/link'
import {
    Briefcase,
    MapPin,
    Calendar,
    ExternalLink,
    IndianRupee,
    Clock,
    AlertCircle
} from 'lucide-react'

const AppliedJobs = () => {
    const { applications } = useAppData()

    const getStatusStyles = (status:string) => {
        switch (status?.toLowerCase()) {
            case 'hired':
            case 'accepted':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'submitted':
            case 'pending':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Applications</h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Track the status of your {applications?.length || 0} job applications.
                    </p>
                </div>

                {!applications || applications.length === 0 ? (
                    <div className="bg-white rounded-[32px] border-2 border-dashed border-gray-200 p-20 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Briefcase className="text-gray-300" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No applications yet</h3>
                        <p className="text-gray-500 mt-2 mb-8">You haven't applied to any jobs. Start your search now!</p>
                        <Link
                            href="/jobs"
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 transition-all"
                        >
                            Find Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {applications.map((app) => (
                            <div
                                key={app.application_id}
                                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-extrabold text-gray-900">{app.job_title}</h2>
                                        {app.subscribed && (
                                            <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter flex items-center gap-1">
                                                <AlertCircle size={10} /> Priority
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm font-medium text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={16} className="text-gray-400" />
                                            {app.job_location}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <IndianRupee size={16} className="text-gray-400" />
                                            {Number(app.job_salary).toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Calendar size={16} className="text-gray-400" />
                                            Applied on {new Date(app.applied_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                                    <div className="flex flex-col items-start md:items-end">
                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Status</span>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusStyles(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/jobs/${app.job_id}`}
                                        className="inline-flex items-center justify-center bg-gray-50 hover:bg-blue-50 text-gray-900 hover:text-blue-600 h-12 px-6 rounded-2xl font-bold transition-all gap-2 border border-gray-100"
                                    >
                                        View Job
                                        <ExternalLink size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AppliedJobs