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

export interface ProjectType {
    typeId: number;
    label: string;
}

// Other

export interface ProjectImage {
    imageId: number;
    url: string;
    altText: string;
}

export interface Member {
    projectId: number;
    userId: number;
    titleId: number;
    permission: number;
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

//all user orivate data
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
    thumbnail?: string;
    purpose?: string;
    status?: string;
    audience?: string;
    createdAt: Date;
    updatedAt: Date;
    projectType: ProjectType[];
    projectTags: Tag[];
    projectImages: ProjectImage[];
    projectSocials: Social[];
    jobs: JobTitle[];
    members: Member[];
    followers?: UserPreview[];
}
