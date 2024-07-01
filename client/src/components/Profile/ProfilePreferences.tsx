export const ProfilePreferences = ({user}) => {
    return (
        <section className="profile-section" id = "profile-preferences">
        <h2>Preferences</h2>
        <h3> Project Preferences:</h3>
        <p>{user.preferences.projectPreference}</p> 
        <h3> Role Preferences:</h3> 
        <p>{user.preferences.rolePreference}</p>
        <h3> Availablity:</h3> 
        <p>{user.preferences.availability}</p>
      </section>
    );
}