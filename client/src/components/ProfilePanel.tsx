import profilePicture from "../images/blue_frog.png";
//Component that will contain info about a profile, used in the discovery page (for now)
//Smaller and more concise than ProfileCard.tsx

//Currently, this component serves as a placeholder

//Takes in a 'profile' value which contains info on the project it will display
export const ProfilePanel = ({height}) => {
  return (
    <div className={'profile-panel'} style={{height: height}}>
      <img src={profilePicture} alt={"profile iamge"}/>
    </div>
  )
}