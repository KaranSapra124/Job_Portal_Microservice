"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppData } from '@/context/appContext';
import { AccountProps } from '@/type'
import { Award, Plus, Sparkles, X } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Skills: React.FC<AccountProps> = ({ user, isYourAccount }) => {
    const { addSkill, btnLoading, removeSkill } = useAppData()
    const [skill, setSkill] = useState("");
    const addSkillHandler = () => {
        if (!skill.trim()) {
            toast.error("Please add a valid skill");
            return;
        }
        addSkill(skill)
        if (!btnLoading) {
            setSkill("")
        }
    }
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            addSkillHandler()
        }
    }
    const removeSkillHandler = (skillToRemove: string) => {
        if (confirm(`Are you sure you want to remove ${skillToRemove} ?`)) {
            removeSkill(skillToRemove)
        }
    }
    return (
        <>
            <div className="max-w-5xl mx-auto px-4 py-6">
                <Card className="shadow-lg border-2 overflow-hidden">
                    <div className="bg-blue-500 p-6 border-b">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <Award size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl text-white">
                                    {isYourAccount ? "Your Skills" : "Skills"}
                                </CardTitle>
                                {
                                    isYourAccount && <CardDescription className='text-sm mt-1 text-white'>
                                        Showcase you expertise and abilities
                                    </CardDescription>
                                }
                            </div>
                        </div>
                        {/* Add Skills Input */}
                        {
                            isYourAccount && <>
                                <div>
                                    <div className='flex gap-3 flex-col sm:flex-row'>
                                        <Sparkles size={18} className='absolute left-3 top-1/2 -translate-y-1/2 opacity-50' />
                                        
                                        <Input type='text' placeholder='eg. React,Node.js...' className='h-11 pl-10 bg-background' value={skill} onChange={(e) => setSkill(e.target.value)} onkeypress={handleKeyPress} />
                                    </div>
                                    <Button onClick={addSkillHandler} className='h-11 gap-2 px-6' disabled={!skill.trim() || btnLoading}><Plus size={18} /> {btnLoading ? "Adding Skill..." : "Add Skill"}</Button>
                                </div>
                            </>
                        }
                        {/* Skills Display */}
                        <CardContent className='p-6'>
                            {user?.skills && user?.skills?.length > 0 ? <>
                                <div className='flex flex-wrap gap-3'>
                                    {user?.skills?.map((elem, index) => (
                                        <>
                                            <div className="bg-white p-1 flex items-center gap-2 rounded-l-full rounded-r-full px-2  text-blue-600 font-semibold shadow shadow-white" key={index}>{elem}{
                                                isYourAccount && <button onClick={() => removeSkillHandler(elem)}><X className='font-extrabold text-white bg-red-500 rounded-full p-0.5  ' size={14} /></button>
                                            }</div>

                                        </>

                                    ))}
                                </div>
                            </> : <>
                            <div className='text-center text-white font-bold text-md'>
                                <h1>{isYourAccount ? "Add some skills to get noticed...":"No skills added by user yet!"}</h1>
                            </div>
                            </>}
                        </CardContent>
                    </div>
                </Card>
            </div>


        </>
    )
}

export default Skills