import { ProjectCard } from "../ProjectCard";
import{projects} from "../../constants/fakeData";

export const ProfileProjects = () => {
    return (
        <section id = "projects">
            <h2>Projects</h2>
            <div className = "list">
            {/* {user.projects.map(proj => (
                <ProjectCard project={projects[proj]}></ProjectCard>
            ))} */}

            <ProjectCard project={projects[0]}></ProjectCard>
            <ProjectCard project={projects[0]}></ProjectCard>
            <ProjectCard project={projects[0]}></ProjectCard>
            <ProjectCard project={projects[0]}></ProjectCard>
            <ProjectCard project={projects[0]}></ProjectCard>
            </div>
        </section>
    );
}