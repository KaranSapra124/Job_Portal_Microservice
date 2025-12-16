"use client"
import { user_service } from '@/context/appContext';
import { User } from '@/type'
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from "js-cookie"
import Loading from '@/components/ui/loading';
import Info from '../(components)/info';

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
                user && <div className='w-[90%] md:w-[60%] m-auto'>
                    <Info user={user} isYourAccount={false} />
                </div>
            }
        </>
    )
}

export default UserAccount