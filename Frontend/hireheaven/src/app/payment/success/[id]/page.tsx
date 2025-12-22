"use client"
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { CheckCircle2, ArrowRight, Download, Home, PartyPopper } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PaymentSuccess = () => {
    const { id } = useParams()
    const router = useRouter()

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 text-center relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500" />
                
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse opacity-50" />
                        <div className="relative bg-green-500 text-white p-4 rounded-full shadow-lg shadow-green-200">
                            <CheckCircle2 size={48} strokeWidth={2.5} />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                    Payment Successful!
                </h1>
                <p className="text-gray-500 font-medium mb-8">
                    Congratulations! Your account has been upgraded to <span className="text-blue-600 font-bold uppercase text-xs tracking-widest px-2 py-1 bg-blue-50 rounded-md">Hire Heaven Pro</span>.
                </p>

                <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
                    <div className="flex justify-between text-sm mb-3">
                        <span className="text-gray-400 font-bold uppercase tracking-tighter">Transaction ID</span>
                        <span className="text-gray-900 font-mono font-bold truncate ml-4">
                            {id}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400 font-bold uppercase tracking-tighter">Status</span>
                        <span className="text-emerald-600 font-black uppercase">Confirmed</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button 
                        onClick={() => router.push('/jobs')}
                        className="w-full h-14 bg-gray-900 hover:bg-blue-600 text-white rounded-2xl font-bold text-lg transition-all group"
                    >
                        Explore Priority Jobs
                        <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <Button 
                            variant="outline" 
                            className="h-12 rounded-xl font-bold border-gray-200"
                            onClick={() => window.print()}
                        >
                            <Download size={18} className="mr-2" />
                            Receipt
                        </Button>
                        <Button 
                            variant="outline" 
                            className="h-12 rounded-xl font-bold border-gray-200"
                            onClick={() => router.push('/')}
                        >
                            <Home size={18} className="mr-2" />
                            Dashboard
                        </Button>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest">
                    <PartyPopper size={14} className="text-yellow-500" />
                    Welcome to the Pro Club
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccess