"use client"
import { CareerGuideResponse, utils_service } from '@/type';
import axios from 'axios';
import { ArrowRight, BookOpen, Briefcase, Lightbulb, Loader2, Sparkles, Target, TrendingUp, X } from 'lucide-react'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const CareerGuide = () => {
    const [open, setOpen] = useState(false);
    const [skills, setSkills] = useState<string[]>([])
    const [currentSkill, setCurrentSkill] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<CareerGuideResponse | null>(null)

    const addSkill = () => {
        if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
            setSkills([...skills, currentSkill.trim()]);
            setCurrentSkill('')
        }
    }
    const removeSkill = (skillToRemove: string) => {
        setSkills(skills?.filter((s) => s !== skillToRemove));
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addSkill()
        }
    }
    const getCareerGuidance = async () => {
        if (skills.length === 0) {
            alert("Please add at least one skill");
            return;
        }
        try {
            const { data } = await axios.post(`${utils_service}/api/utils/career`, {
                skills: skills
            })
            setResponse(data?.jsonResponse);
            // console.log(data)
            alert("Career Guidance Generated")
        } catch (err: any) {
            alert(err?.response?.data?.message)
        } finally {
            setLoading(false)
        }

    }
    const resetDialog = () => {
        setSkills([]);
        setCurrentSkill("");
        setResponse(null)
        setOpen(false)
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-blue-50 dark:bg-blue-950 mb-4">
                        <Sparkles size={16} className="text-blue-600" />
                        <span className="text-sm font-medium">
                            AI-Powered Carrer Guidence
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover Your Carrer Path</h2>
                    <p className="text-lg opacity-70 max-w-2xl mx-auto mb-8">
                        Get persnalized job recommendations and learnings roadmaps based on your skills.
                    </p>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button size={"lg"} className="gap-2 h-12 px-8">
                                <Sparkles size={18} />
                                Get Carrer Guidence
                                <ArrowRight size={18} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            {!response ? (
                                <>
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl flex items-center gap-2">
                                            <Sparkles className="text-blue-600" />
                                            Tell us about your skills
                                        </DialogTitle>
                                        <DialogDescription>
                                            Add your techical skills to recieve personalized recommendations
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="skill">Add Skills</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    onKeyPress={handleKeyPress}
                                                    id="skill"
                                                    placeholder="e.g., React, Node.js, Python..."
                                                    value={currentSkill}
                                                    onChange={(e) => setCurrentSkill(e.target.value)}
                                                    className='h-11'
                                                />
                                                <Button onClick={addSkill} className='gap-2'>Add</Button>
                                            </div>
                                        </div>
                                        {
                                            skills.length > 0 && <div className='space-y-2 '>
                                                <Label>Your Skiils {skills.length}</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {
                                                        skills?.map((s) => {
                                                            return <>
                                                                <div key={s} className='inline-flex items-center gap-2 pl-2 pr-2 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'>
                                                                    <span className='text-sm font-medium '>
                                                                        {s}
                                                                    </span>
                                                                    <button onClick={() => removeSkill(s)} className='h-5 w-5 rounded-full bg-red-500 text-white flex in-checked:justify-center'>
                                                                        <X size={13} />
                                                                    </button>
                                                                </div>
                                                            </>
                                                        })
                                                    }
                                                    <Button className='h-11 w-full gap-2' disabled={loading || skills.length == 0} onClick={getCareerGuidance}>{loading ? <> <Loader2 size={18} className='animate-spin' /> Analyzing Your Skillset... </> : <> <Sparkles size={18} className='animate-spin' />Generate Career Guidance </>}</Button>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                </>
                            ) : (
                                <>
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl flex items-center gap-2">
                                            <Target className="text-blue-600" />
                                            Your Personlized Carrer Guide
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-6 py-4">
                                        {/* summary */}
                                        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-b-blue-200 dark:border-b-blue-800">
                                            <div className="flex items-start gap-3">
                                                <Lightbulb
                                                    className="text-blue-600 mt-1 shrink-0"
                                                    size={20}
                                                />
                                                <div>
                                                    <h3 className="font-semibold mb-2">Career Summary</h3>
                                                    <p className="text-sm leading-relaxed opacity-90">{response?.summary}</p>

                                                </div>
                                            </div>
                                        </div>
                                        {/* Job Options */}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                <Briefcase size={20} className="text-blue-600" />
                                                Recomended Carrer Paths
                                            </h3>

                                            <div className="space-y-3">
                                                {response?.jobOptions?.map((job, index) => (
                                                    <div className='p-4 rounded-lg border hover:border-blue-500 transition-colors' key={index}>
                                                        <h4 className="font-semibold text-base mb-2">
                                                            {job.title}
                                                        </h4>

                                                        <div className="space-y-2 text-sm">
                                                            {/* Added Description field */}
                                                            <div>
                                                                <span className="font-medium opacity-70">Responsibilities:</span>
                                                                <span className='opacity-80'>
                                                                    {job.responsibilities}
                                                                </span>
                                                            </div>
                                                            <span>Why this role:</span>
                                                            <span className='opacity-80 '>{job?.why}</span>

                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Skills to learn */}
                                        <div>
                                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                                <TrendingUp size={20} className="text-blue-600" />
                                                Skills to Enhance Your Carrer
                                            </h3>

                                            <div className="space-y-4">
                                                {response?.skillsTOLearn?.map((category, index) => (
                                                    <div className="space-y-2">
                                                        <h4 key={index} className="font-semibold text-sm text-blue-600">
                                                            {category?.category}
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {category?.skills?.map((skill, sindex) => {
                                                                return <>
                                                                    <div key={sindex} className='p-3 rounded-lg bg-secondary border text-sm '>
                                                                        <p className="font-medium mb-1">{skill.title}</p>
                                                                        <p className="text-xs opacity-70 mb-1">
                                                                            <span className="font-medium">
                                                                                Why: <span>{skill.why}</span>
                                                                            </span>
                                                                        </p>
                                                                        <p className="text-xs opacity-70 mb-1">
                                                                            <span className="font-medium">
                                                                                How: <span>{skill.how}</span>
                                                                            </span>
                                                                        </p>

                                                                    </div>
                                                                </>
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                        {/* Learning approach */}
                                        <div className='p-4 rounded-lg border dark:bg-red-950/20 bg-blue-950/20'>
                                            <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
                                                <BookOpen size={20} className='text-blue-600' />
                                                {response?.learningApproach?.title}
                                            </h3>
                                            <ul className='space-y-2'>{response?.learningApproach?.points?.map((point, index) => {
                                                return <li key={index} className='text-sm flex items-start gap-2'>
                                                    <span className='text-blue-600 mt-0.5 '>•</span>
                                                    <span className='opacity-90' dangerouslySetInnerHTML={{ __html: point }}></span>
                                                </li>
                                            })}</ul>
                                        </div>
                                        <Button onClick={resetDialog} variant={"outline"} className='w-full'>Start New Analysis</Button>
                                    </div>


                                </>
                            )}
                        </DialogContent>

                    </Dialog>
                </div>
            </div>

        </>
    )
}

export default CareerGuide