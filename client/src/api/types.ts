export interface ApiResponse<_data = any> {
    status: number;
    error?: string | null;
    data?: _data | null;
    memetype?: string;
};

export interface User {
    id: number
    email: string;
    firstName: string;
    lastName: string;
    headline: string;
    pronouns: string;
    jobTitleId: number;
    majorId: number;
    academicYear: number;
    location: string;
    funFact: string;
    skills: Skill[];
    socials: Social[];
    profilePicture?: string;
    visibility: number;
}

export interface Project {
    userId: number,
    title: string,
    hook: string,
    desc: string,
    purpose: string,
    status: string,
    audience: string,
    pTypes: ProjectType[],
    pTags: Tag[],
    jobs: JobTitles[],
    members: Member[],
    socials: Social[],
}

export interface Member {
    userId: number;
    titleId: number;
    permission: number;
}


/* DATASETS */

//EDIT THESE AS NEEDED
export interface Skill {
    id: number;
    name: string;
}

export interface Major {
    id: number;
    name: string;
}

export interface ProjectType {
    id: number;
    name: string;
}

export interface Tag {
    id: number;
    name: string;
}

export interface JobTitles {
    id: number;
    name: string;
}


export interface Social {
    id: number;
    name: string;
    url: string;
}