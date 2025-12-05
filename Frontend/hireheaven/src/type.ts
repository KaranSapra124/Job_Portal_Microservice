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

export const utils_service = "http://localhost:5001"