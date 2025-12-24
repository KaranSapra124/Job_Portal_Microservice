import { ArrowRight, Briefcase, Search, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'

const Hero = () => {
    return (
        <>
            <section className='relative overflow-hidden bg-secondary'>
                <div className='absolute inset-0 opacity-5'>
                    <div className='absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full  blur-3xl'>
                    </div>
                    <div className='absolute bottom-20 right-10 w-96 h-96 rounded-full  blur-3xl'>
                    </div>
                </div>
                <div className='container mx-auto px-5 py-2 md:py-24 relative'>
                    <div className="flex flex-col-reverse md:flex-row items-center gap-5 md:gap-16">
                        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
                            {/* Badge */}
                            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-background/50 backdrop-blur-sm'>
                                <TrendingUp size={16} className='text-blue-600' />
                                <span className='md:text-sm text-xs font-medium'>#1 Job Platform In India</span>
                            </div>
                            {/* Main Heading */}
                            <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                Find Your Dream Job At <span className='inline-block '>Hire <span className='text-red-600'>Heaven</span></span>
                            </h1>
                            {/* description */}
                            <p className="text-sm font-semibold md:text-xl leading-relaxed opacity-80 max-w-2xl">
                                Connect With Top Employers & Discover opportunities that match your skills. Whether you're a job seeker or recruiter , we've got you convered with powerful tools & seamless experience.
                            </p>
                            {/* stats */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 py-2">
                                <div className="text-center md:text-left">
                                    <p className='text-xl md:text-4xl font-bold text-blue-800'>10k+</p>
                                    <p className='text-sm opacity-70 font-semibold'>Active Jobs</p>

                                </div>
                                <div className="text-center md:text-left">
                                    <p className='text-xl md:text-4xl font-bold text-blue-800'>5k+</p>
                                    <p className='text-sm opacity-70 font-semibold'>Companies</p>
                                </div>
                                <div className="text-center md:text-left">
                                    <p className='text-xl md:text-4xl font-bold text-blue-800'>50k+</p>
                                    <p className='text-sm opacity-70 font-semibold'>Job Seekers</p>
                                </div>
                            </div>
                            <div className="flex  gap-2 pt-2">
                                <Link href={"/jobs"}>
                                    <Button size={"lg"} className='text-base px-2 h-9 gap-2 group transition-all'>
                                        <Search size={18} />
                                        Browse Jobs <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                                    </Button></Link>
                                <Link href={"/about"}>
                                    <Button size={"lg"} variant={"outline"} className='text-base px-2 h-9 gap-2 group transition-all'>
                                        <Briefcase size={18} />
                                        Learn More
                                    </Button></Link>
                            </div>
                            {/* Trust Indicator Section */}
                            <div className="flex  items-center gap-1 text-sm opacity-50 pt-2">
                                <span className='text-xs md:text-sm font-semibold'>✔️ Free To Use</span>
                                <span>|</span>
                                <span className='text-xs md:text-sm font-semibold'>✔️ Verified employers</span>
                                <span>|</span>
                                <span className='text-xs md:text-sm font-semibold'>✔️ Secure platform</span>
                                
                            </div>
                        </div>
                        {/* Image section */}
                        <div className="flex-1 bottom-52 relative">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-blue-400 opacity-20 blue-xl group-hover:opacity-80 transition-opacity">
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-background">
                                        <img src="https://images.unsplash.com/photo-1698047682091-782b1e5c6536?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" className='object-cover object-center w-full h-full transform rounded-2xl transition-transform duration-500 group-hover:scale-105' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}

export default Hero