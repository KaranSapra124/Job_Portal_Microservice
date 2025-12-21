import React, { ReactNode } from "react";

export interface JobOptions {
    title: string;
    responsibilities: string;
    why: string;
}
export interface skillsToLearn {
    title: string;
    why: string;
    how: string;
}
export interface skillsCategory {
    category: string;
    skills: skillsToLearn[]
}
export interface LearningApproach {
    title: string;
    points: string[]
}

export interface CareerGuideResponse {
    summary: string;
    jobOptions: JobOptions[];
    skillsTOLearn: skillsCategory[];
    learningApproach: LearningApproach;
}

export interface ScoreBreakdown {
    formatting: {
        score: number;
        feedback: string
    };
    keywords: {
        score: number;
        feedback: string
    }
    strucuture: {
        score: number;
        feedback: string
    }
    readability: {
        score: number;
        feedback: string
    }
}

export interface Suggestion {
    category: string;
    issue: string;
    recommendation: string;
    priority: "high" | "medium" | "low"
}
export interface ResumeAnalysisResponse {
    atsScore: number;
    scoreBreakdown: ScoreBreakdown;
    suggestions: Suggestion[];
    strengths: string[];
    summary: string;
}

export interface User {
    user_id: number;
    name: string;
    email: string;
    phone_number: string;
    role: "jobseeker" | "recruiter";
    bio: string | null;
    resume: string | null;
    resume_public_id: string | null;
    profile_pic: string | null;
    profile_pic_public_id: string | null;
    skills: string[];
    subscription: string | null;
}

export interface AppContextType {
    user: User | null;
    loading: boolean;
    btnLoading: boolean;
    isAuth: boolean;
    logoutUser: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>;
    updateProfilePic: (formData: any) => Promise<void>;
    updateResume: (formData: any) => Promise<void>;
    updateUser: (name: string, phoneNumber: string, bio: string) => Promise<void>;
    addSkill: (skill: string) => Promise<void>;
    removeSkill: (skill: string) => Promise<void>;
    applyForJob: (jobId: number) => Promise<void>;
    applications: Application[] | null;
    getJobApplications: () => Promise<void>
}

export interface AppProviderProps {
    children: ReactNode

}
export interface AccountProps {
    user: User;
    isYourAccount: boolean;
}

export interface Job {
    job_id?: number;
    title: string;
    description: string;
    salary: number | null;
    location: string | null;
    job_type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
    openings: number;
    role: string;
    work_location: 'On-site' | 'Hybrid' | 'Remote';
    company_id: number | null;
    company_logo: string;
    posted_by_recruiter_id: number | null;
    created_at?: string;
    is_active: boolean;
}

export interface Company {
    company_id: string;
    name: string;
    description: string;
    logo: string;
    logo_public_id: string;
    recruiter_id: number;
    created_at: string;
    jobs?: Job[];
    website?: string;
}
type ApplicationStatus = "Submitted" | "Rejected" | "Hired";

export interface Application {
    application_id: number;
    job_id: number;
    applicant_id: number;
    applicant_email: string;
    status: ApplicationStatus;
    resume: string;
    applied_at: string;
    subscribed: boolean;
    job_title: string;
    job_salary: number;
    job_location: string;
}