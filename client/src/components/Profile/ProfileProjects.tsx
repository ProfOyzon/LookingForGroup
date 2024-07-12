import { ProjectCard } from "../ProjectCard";
import{projects} from "../../constants/fakeData";
import { ProfileProjectCard } from "../ProfileProjectCard";

export const ProfileProjects = ({user}) => {
    return (
        <section className="profile-section" id = "profile-projects">
            <h2>Projects</h2>
            <div className = "profile-list">
            {user.projects.map(proj => (
                <ProfileProjectCard projectID={proj} userID={user._id}></ProfileProjectCard>
            ))}
            </div>
        </section>
    );
}