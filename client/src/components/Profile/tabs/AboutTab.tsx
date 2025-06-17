import { useState, useEffect } from 'react';
import { ProfileData } from '../ProfileEditPopup';
import { RoleSelector } from '../../RoleSelector';
import { MajorSelector } from '../../MajorSelector';
import { ImageUploader, uploadImage } from '../../ImageUploader';

// Methods
const setUpInputs = async (profileData: ProfileData) => {
  console.log(profileData);

  // Obtain roles and majors to obtain the proper label for the Role Selector and Major Selector
  let roles: any, majors: any;
  const getRolesAndMajors = async () => {
    const roleResponse = await fetch(`/api/datasets/job-titles`);
    const majorResponse = await fetch(`/api/datasets/majors`);

    roles = await roleResponse.json();
    majors = await majorResponse.json();
    roles = roles.data;
    majors = majors.data;
  };

  // Used to avoid repetition and map values onto element IDs.
  const pairInputToData = (input: string, data: any) => {
    const inputElement = document.getElementById(`profile-editor-${input}`) as HTMLInputElement;
    if (inputElement) {
      inputElement.value = data;
    }
  };

  // Obtain information
  await getRolesAndMajors();
  // Pair information
  pairInputToData('firstName', profileData.first_name);
  pairInputToData('lastName', profileData.last_name);
  pairInputToData('pronouns', profileData.pronouns);
  pairInputToData('jobTitle', roles.find((r: any) => r.label === profileData.job_title).title_id);
  pairInputToData('major', majors.find((r: any) => r.label === profileData.major).major_id);
  pairInputToData('academicYear', profileData.academic_year);
  pairInputToData('location', profileData.location);
  pairInputToData('headline', profileData.headline);
  pairInputToData('funFact', profileData.fun_fact);
  pairInputToData('bio', profileData.bio);
  // Load in the profile picture
  uploadImage(`/images/profiles/${profileData.profile_image}`);
};

// Components
const TextArea = (props: {
  title: string;
  description: string;
  count: number;
  maxLength: number;
  id: string;
}) => {
  // Keeps track of the character count
  const [charCount, setCharCount] = useState(props.count);

  return (
    <div className="editor-input-item editor-input-textarea">
      <label>{props.title}</label>
      <div className="project-editor-extra-info">{props.description}</div>
      <span style={{bottom: '-20px'}} className="character-count">
        {charCount}/{props.maxLength}
      </span>
      <textarea
        id={`profile-editor-${props.id}`}
        maxLength={props.maxLength}
        onChange={(e) => {
          setCharCount(e.target.value.length);
        }}
      />
    </div>
  );
};

// Main Component
export const AboutTab = (props: { profile: ProfileData }) => {
  // Effects
  useEffect(() => {
    const setUp = async () => {
      await setUpInputs(props.profile);
    };
    setUp();
  }, []);

  return (
    <div id="profile-editor-about" className="edit-profile-body about">
      <div className="edit-profile-section-1">
        <div id="profile-editor-add-image" className="edit-profile-image">
          <ImageUploader />
        </div>

        <div className="about-row row-1">
          <div className="editor-input-item">
            <label>First Name*</label>
            {/* <br /> */}
            <input id="profile-editor-firstName" type="text" maxLength={50}></input>
          </div>
          <div className="editor-input-item">
            <label>Last Name*</label>
            {/* <br /> */}
            <input id="profile-editor-lastName" type="text" maxLength={50}></input>
          </div>
          <div className="editor-input-item">
            <label>Pronouns</label>
            {/* <br /> */}
            <input id="profile-editor-pronouns" type="text" maxLength={25}></input>
          </div>
        </div>

        <div className="about-row row-2">
          {<RoleSelector />}
          {<MajorSelector />}
          <div className="editor-input-item">
            <label>Year</label>
            <select id="profile-editor-academicYear">
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
              <option>4th</option>
              <option>5th</option>
            </select>
          </div>
        </div>

        <div className="about-row row-3">
          <div className="editor-input-item">
            <label>Location</label>
            <input id="profile-editor-location" maxLength={150} type="text"></input>
          </div>
        </div>
      </div>

      <div className="edit-profile-section-2">
        <TextArea
          title={'Personal Quote'}
          description={'Write a fun and catchy phrase that captures your unique personality!'}
          count={props.profile.headline ? props.profile.headline.length : 0}
          maxLength={100}
          id={'headline'}
        />

        <TextArea
          title={'Fun Fact'}
          description={'Share a fun fact about yourself that will surprise others!'}
          count={props.profile.fun_fact ? props.profile.fun_fact.length : 0}
          maxLength={100}
          id={'funFact'}
        />
      </div>
      
      <div className="edit-profile-section-3">
        <TextArea
          title={'About Me*'}
          description={
            'Share a brief overview of who you are, your interests, and what drives you!'
          }
          count={props.profile.bio ? props.profile.bio.length : 0}
          maxLength={600}
          id={'bio'}
        />
      </div>
    </div>
  );
};
