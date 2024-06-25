import { Tags } from "../Tags";

export const ProfileLinks = ({user}) => {
    return (
        <section id = "links">
        <h2>Links</h2>
        <div className="list">
          {user.links.map(link => (
            <Tags>{link.text}</Tags>
          ))}
        </div>
      </section>
    );
}