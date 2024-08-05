import { Tags } from "../Tags";

export const ProfilePreferences = ({user}) => {
    return (
        <section className="profile-section" id = "profile-preferences">
          <h1>Preferences</h1>
          <div className="profile-list">
            {user.preferences.map(preference => <Tags>{preference}</Tags>)}
          </div>
      </section>
    );
}