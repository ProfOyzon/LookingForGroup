// Enums for better typing
export type SkillType = "Developer" | "Designer" | "Artist" | "Music" | string;
export type TagType =
    | "Creative"
    | "Technical"
    | "Games"
    | "Multimedia"
    | "Music"
    | "Other"
    | "Developer Skill"
    | "Designer Skill"
    | "Soft Skill"
    | "Purpose"
    | string;
export type AcademicYear =
    | "Freshman"
    | "Sophomore"
    | "Junior"
    | "Senior"
    | "Graduate"
    | string;

//API response

export interface ApiResponse<_data = any> {
    status: number;
    error?: string | null;
    data?: _data | null;
    memetype?: string;
}

// Datasets

export interface JobTitle {
    titleId: number;
    label: string;
}

export interface Major {
    majorId: number;
    label: string;
}

export interface Tag {
    tagId: number;
    label: string;
    type: TagType;
}

export interface Social {
    websiteId: number;
    label: string;
}

export interface Skill {
    skillId: number;
    label: string;
    type: SkillType;
    position: number;
}

export interface ProjectGenres {
    typeId: number;
    label: string;
}

// Other

//there is no alt text in database yet
export interface ProjectImage {
    imageId: number;
    image: string;
    altText: '';
}

//permissions not yet in database
export interface Member {
    projectId: number;
    userId: number;
    titleId: number;
    //permission: number;
}

// Users

//show only preview data
export type UserPreview = {
    userId: number;
    firstName: string;
    lastName: string;
    username: string;
    profileImage?: string | null;
};

//show only non-sensitive data
export type UserDetail = {
    userId: number;
    firstName: string;
    lastName: string;
    username: string;
    profileImage: string | null;
    headline: string | null;
    pronouns: string | null;
    jobTitle: string | null;
    major: string | null;
    academicYear: string | null;
    location: string | null;
    funFact: string | null;
    bio?: string | null;
    skills?: Skill[] | null;
    socials?: Social[] | null;
};

//user followings
export type UserFollowing = {
    userId: number;
    followingId: number;
    followedAt: Date;
};

//all user private data
export interface User {
    userId: number;
    username: string;
    ritEmail: string;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
    headline: string | null;
    pronouns: string | null;
    jobTitleId: number | null;
    majorId: number | null;
    academicYear: string | null;
    location: string | null;
    funFact: string | null;
    bio: string | null;
    visibility: number;
    skills?: Skill[] | null;
    socials?: Social[] | null;
    phoneNumber: string | null;
    universityId: number | null;
    createdAt: Date;
    updatedAt: Date;
}

//creating users
export interface CreateUserData {
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
}

// Projects

export interface Project {
    projectId: number;
    title: string;
    hook: string;
    description: string;
    thumbnail?: string | null;
    purpose?: string | null;
    status?: string | null;
    audience?: string | null;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    projectType: ProjectGenres[];
    projectTags: ProjectTag[];
    projectImages: ProjectImage[];
    projectSocials: Social[];
    jobs: Job[];
    members: Member[];
}

// Represents the followers info for a project
export interface ProjectFollowers {
    count: number;
}

// project with the followers data
export interface ProjectWithFollowers extends Project {
    followers: ProjectFollowers;
}

//Jobs for projects
export interface Job {
    projectId: number;
    titleId: number;
    availability: string;
    duration: string;
    location: string;
    compensation: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

//tags for projects
export interface ProjectTag {
    projectId: number;
    tagId: number;
    label: string;
    type: TagType;
    position: number;
}