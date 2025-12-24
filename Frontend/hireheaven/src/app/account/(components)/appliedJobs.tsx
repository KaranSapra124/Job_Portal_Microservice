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
    AlertCircle,
    ChevronRight,
    Trophy,
    CheckCircle2,
    XCircle,
    Timer
} from 'lucide-react'

const AppliedJobs = () => {
    const { applications } = useAppData()

    const getStatusStyles = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'hired':
            case 'accepted':
                return {
                    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    icon: <CheckCircle2 size={12} />
                };
            case 'rejected':
                return {
                    bg: 'bg-rose-50 text-rose-700 border-rose-200',
                    icon: <XCircle size={12} />
                };
            case 'submitted':
            case 'pending':
                return {
                    bg: 'bg-blue-50 text-blue-700 border-blue-200',
                    icon: <Timer size={12} />
                };
            default:
                return {
                    bg: 'bg-slate-50 text-slate-700 border-slate-200',
                    icon: <Clock size={12} />
                };
        }
    }

    const stats = [
        { label: 'Total', count: applications?.length || 0, icon: Briefcase, color: 'text-blue-600' },
        { label: 'Pending', count: applications?.filter(a => a.status === 'Submitted').length || 0, icon: Timer, color: 'text-amber-600' },
        { label: 'Accepted', count: applications?.filter(a => a.status === 'Hired').length || 0, icon: Trophy, color: 'text-emerald-600' },
    ]

    return (
        <div className="max-w-5xl   mx-auto mb-4">
            <div className='mx-4 rounded-2xl shadow-2xl'>
                {/* Header Section */}
                <div className="flex rounded-t-2xl flex-col md:flex-row md:items-end justify-between mb-10 gap-6 bg-gradient-to-r from-blue-600 to-indigo-700 md:p-6 p-4">
                    <div >
                        <h1 className="md:text-4xl text-xl font-black text-white tracking-tight">Application Tracker</h1>
                        <p className="text-white mt-2 font-medium text-xs md:text-lg">
                            You have applied to <span className="text-blue-800 px-2 rounded mx-0.5 bg-white font-extrabold">{applications?.length || 0} positions</span> across various industries.
                        </p>
                    </div>

                    {/* Summary Mini-Cards */}
                    <div className="flex gap-2">
                        {stats.map((s, i) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-3 px-5 shadow-sm hidden sm:block">
                                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">{s.label}</p>
                                <p className={`text-xl font-black ${s.color}`}>{s.count}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {!applications || applications.length === 0 ? (
                    <div className="bg-white rounded-[3rem] border-2 border-dashed border-gray-100 p-16 text-center shadow-sm">
                        <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <Briefcase className="text-blue-500" size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900">Your journey starts here</h3>
                        <p className="text-gray-500 mt-3 mb-10 max-w-sm mx-auto font-medium">
                            Once you apply for a job, you'll be able to track its interview stages and status right here.
                        </p>
                        <Link
                            href="/jobs"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-gray-900 transition-all shadow-xl shadow-blue-100 hover:shadow-none active:scale-95"
                        >
                            Explore Openings <ChevronRight size={20} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-2">
                        {applications.map((app) => {
                            const style = getStatusStyles(app.status);
                            return (
                                <div
                                    key={app.application_id}
                                    className="group bg-white rounded m-4 border-l-4  p-2 md:p-4 border border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="md:text-2xl text-xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                                                {app.job_title}
                                            </h2>
                                            {app.subscribed && (
                                                <span className="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-amber-100">
                                                    <AlertCircle size={10} fill="currentColor" className="text-amber-200" /> Premium App
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex  md:gap-y-3 gap-y-1 gap-x-1 md:gap-x-8 text-sm font-bold text-gray-400">
                                            <span className="flex items-center text-xs gap-0.5 md:gap-2 hover:text-gray-600 transition-colors">
                                                <div className="p-1  bg-gray-50 rounded-lg"><MapPin size={14} /></div>
                                                {app.job_location}
                                            </span>
                                            <span className="flex items-center text-xs gap-0.5 md:gap-2 hover:text-gray-600 transition-colors">
                                                <div className="p-1  bg-gray-50 rounded-lg"><IndianRupee size={14} /></div>
                                                {Number(app.job_salary).toLocaleString()} / yr
                                            </span>
                                            <span className="flex items-center text-xs gap-0.5 md:gap-2 hover:text-gray-600 transition-colors">
                                                <div className="p-1  bg-gray-50 rounded-lg"><Calendar size={14} /></div>
                                                {new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col lg:flex-row items-center gap-4 border-t md:border-t-0 pt-5 md:pt-0">
                                        <div className="flex-1 md:flex-none flex flex-col items-start md:items-end">
                                            <span className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all ${style.bg}`}>
                                                {style.icon}
                                                {app.status}
                                            </span>
                                        </div>

                                        <Link
                                            href={`/jobs/${app.job_id}`}
                                            className="bg-slate-900 text-white h-8 md:h-14 px-8 rounded-xl font-black hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-slate-100"
                                        >
                                            Details
                                            <ExternalLink size={18} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

        </div>
    )
}

export default AppliedJobs