"use client"
import { job_service, useAppData } from '@/context/appContext'
import React, { useEffect, useRef, useState } from 'react'
import Cookies from "js-cookie"
import axios from 'axios'
import toast from 'react-hot-toast'
import Loading from '@/components/ui/loading'
import { Building2, Plus } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const Company = () => {
    const { loading } = useAppData();
    const addRef = useRef<HTMLButtonElement | null>(null);
    const [name, setName] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [website, setWebsite] = useState("")
    const [description, setDescription] = useState("")
    const [companies, setCompanies] = useState([])
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
                                    <Button onAbort={openDialog} className='gap-2'>
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
                                {companies.map((c) => (
                                    <div
                                        key={c.company_id}
                                        className="flex items-center gap-4 p-4 rounded-lg border-2 hover:border-blue-500 transition-all bg-background"
                                    ></div>
                                ))}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>

                </Card>

            </div>

        </>
    )
}

export default Company