import { ProjectCard } from "../ProjectCard";
import{projects} from "../../constants/fakeData";

export const ProfileProjects = ({user}) => {
    return (
        <section className="profile-section" id = "profile-projects">
            <h2>Projects</h2>
            <div className = "list">
            {user.projects.map(proj => (
                <ProjectCard project={projects[proj]}></ProjectCard>
            ))}
            </div>
        </section>
    );
}