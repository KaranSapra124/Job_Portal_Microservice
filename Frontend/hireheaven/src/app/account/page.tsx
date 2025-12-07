"use client"
import Loading from '@/components/ui/loading'
import { useAppData } from '@/context/appContext'
import React from 'react'

const Account = () => {
    const { isAuth, user, loading } = useAppData()
    if (loading) {
        return <Loading />
    }
    return (
        <div>Account</div>
    )
}

export default Account