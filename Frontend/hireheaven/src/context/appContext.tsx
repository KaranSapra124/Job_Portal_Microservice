"use client"

import { AppContextType, Application, AppProviderProps, User } from "@/type"
import { createContext, useContext, useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Cookies from "js-cookie"
import axios from "axios"

export const utils_service = "http://13.233.225.39:5001"
export const auth_service = "http://13.233.225.39:5000"
export const user_service = "http://13.233.225.39:5002"
export const job_service = "http://13.233.225.39:5003"
export const payment_service = "http://13.233.225.39:5004"
const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuth, setIsAuth] = useState(false)
    const [loading, setLoading] = useState(true)
    const [applications, setApplications] = useState<Application[] | null>(null)
    const [btnLoading, setBtnLoading] = useState(false)


    const token = Cookies?.get("token");

    async function fetchUser() {
        try {
            const { data } = await axios.get(`${user_service}/api/user/me `, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setUser(data)
            setIsAuth(true)
        } catch (error: any) {
            console.log(error)
            setIsAuth(false)
        }
        finally {
            setLoading(false)
        }
    }

    async function logoutUser() {
        Cookies?.remove("token");
        setIsAuth(false)
        setUser(null)
        toast.error("Logged Out Successfully!")
    }
    async function updateProfilePic(formData: any) {
        setLoading(true)
        try {
            const { data } = await axios.put(`${user_service}/api/user/update-profile-pic`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message);
            fetchUser()
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
        finally {
            setLoading(false)
        }
    }
    async function updateResume(formData: any) {
        setLoading(true)
        try {
            const { data } = await axios.put(`${user_service}/api/user/update-user-resume`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message);
            fetchUser()
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
        finally {
            setLoading(false)
        }
    }
    async function updateUser(name: string, phoneNumber: string, bio: string) {
        setBtnLoading(true)
        try {
            const { data } = await axios.put(`${user_service}/api/user/update-user`, { name, phoneNumber, bio }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message);
            fetchUser()
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
        finally {
            setBtnLoading(false)
        }
    }
    async function addSkill(skill: string) {
        setBtnLoading(true)
        try {
            const { data } = await axios.post(`${user_service}/api/user/skill/add`, { skillName: skill }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message);
            fetchUser()
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
        finally {
            setBtnLoading(false)
        }
    }
    async function removeSkill(skill: string) {
        setBtnLoading(true)
        try {
            const { data } = await axios.put(`${user_service}/api/user/skill/delete`, { skillName: skill }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message);
            fetchUser()
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
        finally {
            setBtnLoading(false)
        }
    }

    async function applyForJob(jobId?: number) {
        setBtnLoading(true)
        try {
            const { data } = await axios.post(`${user_service}/api/user/apply`, { jobId: jobId }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message);
            fetchUser()
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
        finally {
            setBtnLoading(false)
        }
    }
    async function getJobApplications() {
        setBtnLoading(true)
        try {
            const { data } = await axios.get(`${user_service}/api/user/get-applications`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data?.message);
            setApplications(data)
        } catch (error: any) {
            toast.error(error?.response?.data?.message)
        }
        finally {
            setBtnLoading(false)
        }
    }

    useEffect(() => {
        fetchUser()
        getJobApplications()
    }, [])

    return <AppContext.Provider value={{
        user, logoutUser, loading, isAuth, btnLoading, setUser, setIsAuth, setLoading, updateProfilePic, updateResume, updateUser, addSkill, removeSkill, applyForJob,applications,getJobApplications
    }}>
        {children}
        < Toaster />
    </AppContext.Provider >
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppData must be used within app provider")
    }
    return context
}