"use client"
import { user_service } from '@/context/appContext';
import { User } from '@/type'
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie"
import Loading from '@/components/ui/loading';
import Info from '../(components)/info';
import Skills from '../(components)/skills';
import AppliedJobs from '../(components)/appliedJobs';

const UserAccount = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true)
    const { id } = useParams()
    console.log(id)
    async function fetchUser() {
        const token = Cookies.get("token")
        try {
            const { data } = await axios.get(`${user_service}/api/user/user-profile/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(data)
        } catch (error: any) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchUser()
    }, [id])
    if (loading) return <Loading />
    return (
        <>
            {
                user && <div className='max-w-5xl m-auto'>
                    <Info user={user} isYourAccount={false} />

                </div>
            }
            {user?.role === "jobseeker" && <Skills user={user} isYourAccount={true} />}
              {
                        user?.role === "jobseeker" && <AppliedJobs />
                    }
        </>
    )
}

export default UserAccount