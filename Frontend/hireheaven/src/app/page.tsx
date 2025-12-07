"use client"
import CareerGuide from '@/components/Home/Career-guide'
import Hero from '@/components/Home/hero'
import ResumeAnalyzer from '@/components/Home/resume-analyzer'
import Loading from '@/components/ui/loading'
import { useAppData } from '@/context/appContext'
import React from 'react'

const Home = () => {
  const { loading } = useAppData()

  if (loading) {
    return <Loading />
  }
  return (
    <div>
      <Hero />
      <CareerGuide />
      <ResumeAnalyzer />
    </div>
  )
}

export default Home