"use client"
import React, { useState } from 'react'
import { Award, Plus, Sparkles, X, BrainCircuit, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppData } from '@/context/appContext'
import { AccountProps } from '@/type'
import toast from 'react-hot-toast'

const Skills: React.FC<AccountProps> = ({ user, isYourAccount }) => {
    const { addSkill, btnLoading, removeSkill } = useAppData()
    const [skill, setSkill] = useState("");

    const addSkillHandler = () => {
        if (!skill.trim()) {
            toast.error("Please add a valid skill");
            return;
        }
        addSkill(skill);
        setSkill("");
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") addSkillHandler();
    }

    const removeSkillHandler = (skillToRemove: string) => {
        // Using a cleaner toast or custom modal is better than confirm(), 
        // but keeping logic consistent with yours.
        if (confirm(`Are you sure you want to remove ${skillToRemove}?`)) {
            removeSkill(skillToRemove);
        }
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-4">
            <Card className="shadow-2xl border-none overflow-hidden bg-card">
                {/* Header Section with Gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 md:p-8 p-4">
                    <div className="flex items-center gap-2">
                        <div className="md:h-14 h-12 md:w-14 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                            <Award size={32} className="text-white" />
                        </div>
                        <div>
                            <CardTitle className="md:text-4xl text-lg font-black text-white tracking-tight">
                                {isYourAccount ? "My Skillset" : "Professional Skills"}
                            </CardTitle>
                            <CardDescription className="text-blue-100 text-xs font-medium opacity-80 mt-1">
                                {isYourAccount 
                                    ? "Add your technical expertise to get discovered by recruiters." 
                                    : `Technical competencies verified by Hire Heaven.`}
                            </CardDescription>
                        </div>
                    </div>
                </div>

                <CardContent className="md:p-8 p-4">
                    {/* Add Skill Input - Modern Floating Style */}
                    {isYourAccount && (
                        <div className="mb-10 group">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 ml-1">
                                Add New Skill
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Sparkles 
                                        size={18} 
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 opacity-50 group-focus-within:opacity-100 transition-opacity" 
                                    />
                                    <Input 
                                        type="text" 
                                        placeholder="eg. Tailwind CSS, Golang, AWS..." 
                                        className="md:h-14 h-10 pl-12 rounded border-gray-100 bg-gray-50/50 text-md font-medium focus-visible:ring-blue-500 focus-visible:bg-white transition-all" 
                                        value={skill} 
                                        onChange={(e) => setSkill(e.target.value)} 
                                        onKeyPress={handleKeyPress} 
                                    />
                                </div>
                                <Button 
                                    onClick={addSkillHandler} 
                                    className="md:h-14 h-10 px-8 rounded font-bold text-md shadow-lg shadow-blue-200 active:scale-95 transition-all"
                                    disabled={!skill.trim() || btnLoading}
                                >
                                    {btnLoading ? "Processing..." : <><Plus size={20} className="mr-2" /> Add Skill</>}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Skills Grid */}
                    {user?.skills && user?.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {user?.skills?.map((elem, index) => (
                                <div 
                                    key={index}
                                    className="group flex items-center gap-2 bg-white border border-gray-100 hover:border-blue-400 hover:shadow-md px-4 py-2.5 rounded-xl transition-all duration-200"
                                >
                                    <BrainCircuit size={16} className="text-blue-500" />
                                    <span className="text-gray-800 font-bold text-sm tracking-tight">
                                        {elem}
                                    </span>
                                    
                                    {isYourAccount && (
                                        <button 
                                            onClick={() => removeSkillHandler(elem)}
                                            className="ml-1 p-1 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <X size={14} strokeWidth={3} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 flex flex-col items-center justify-center text-center rounded-[2.5rem] border-2 border-dashed border-gray-100">
                            <div className="bg-blue-50 p-6 rounded-full mb-4">
                                <Rocket size={40} className="text-blue-200" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Your profile is a blank canvas</h3>
                            <p className="text-gray-400 font-medium max-w-xs mt-1">
                                {isYourAccount 
                                    ? "Add your first skill above to start appearing in search results." 
                                    : "This user hasn't added any skills yet."}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default Skills