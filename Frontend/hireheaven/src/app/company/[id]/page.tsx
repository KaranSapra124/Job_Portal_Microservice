"use client"
import { job_service, useAppData } from '@/context/appContext';
import { Company } from '@/type';
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import Cookies from "js-cookie"

const CompanyPage = () => {
    const token = Cookies.get("token")
    const {user} = useAppData()
    const { id } = useParams();
    const [comapnyDetail, setCompanyDetail] = useState<Company | null>(null)
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
    const isRecruiter = user && comapnyDetail && user?.user_id === comapnyDetail?.recruiter_id;
    useEffect(() => {
        fetchCompany()
    }, [id])




    return (
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
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Open Positions</h2>
                                {comapnyDetail.job && comapnyDetail.job.length > 0 ? (
                                    <div className="space-y-4">
                                        {comapnyDetail.job.map((j: any) => (
                                            <div key={j.id} className="p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                                                <h3 className="font-medium text-blue-600">{j.title}</h3>
                                                <p className="text-sm text-gray-500">{j.location} • {j.type}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">No job openings at the moment.</p>
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
            :<h1>You are forbidden to access this page.</h1>}
        </div>
    );
}

export default CompanyPage