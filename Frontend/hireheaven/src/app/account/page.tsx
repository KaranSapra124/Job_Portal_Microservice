"use client"
import Loading from '@/components/ui/loading'
import { useAppData } from '@/context/appContext'
import React from 'react'
import Info from './(components)/info'
import Skills from './(components)/skills'
import Company from './(components)/company'
import { redirect } from 'next/navigation'
import AppliedJobs from './(components)/appliedJobs'

const Account = () => {
    const { isAuth, user, loading } = useAppData()
    if (!isAuth) return redirect("/login")
    if (loading) {
        return <Loading />
    }
    return (
        <>
            {
                user && <div className='w-[90%] md:w-[60%] m-auto'>
                    <Info user={user} isYourAccount={true} />
                    {user?.role === "jobseeker" && <Skills user={user} isYourAccount={true} />}
                    {user?.role === "recruiter" && <Company />}
                    {
                        user?.role === "jobseeker" && <AppliedJobs />
                    }

                </div>
            }
        </>
    )
}

export default Account