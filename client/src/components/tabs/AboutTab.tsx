import { useState, useEffect } from 'react';
import { sendPut, sendFile, fetchUserID } from '../../functions/fetch';
import { RoleSelector } from '../RoleSelector';
import { MajorSelector } from '../MajorSelector';
import { ImageUploader } from '../ImageUploader';

export const AboutTab = (props) => {
    // Effects
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const id = await fetchUserID();
          const response = await fetch(`/api/users/${id}`);
          const { data } = await response.json();
          await data;
  
          await props.setUpInputs(data);
        } catch (err) {
          console.log('Error fetching profile: ' + err);
        }
      };
      fetchProfile();
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
              <input id="profile-editor-firstName" type="text"></input>
            </div>
            <div className="editor-input-item">
              <label>Last Name*</label>
              {/* <br /> */}
              <input id="profile-editor-lastName" type="text"></input>
            </div>
            <div className="editor-input-item">
              <label>Pronouns</label>
              {/* <br /> */}
              <input id="profile-editor-pronouns" type="text"></input>
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
              </select>
            </div>
          </div>
          <div className="about-row row-3">
            <div className="editor-input-item">
              <label>Location</label>
              {/* <br /> */}
              <input id="profile-editor-location" type="text"></input>
            </div>
          </div>
        </div>
        <div className="edit-profile-section-2">
          <div className="editor-input-item editor-input-textarea">
            <label>Personal Quote</label>
            <div className="project-editor-extra-info">
              Write a fun and catchy phrase that captures your unique personality!
            </div>
            <span className="character-count">0/100</span>
            <textarea id="profile-editor-headline" maxLength={100} />
          </div>
  
          <div className="editor-input-item editor-input-textarea">
            <label>Fun Fact</label>
            <div className="project-editor-extra-info">
              Share a fun fact about yourself that will surprise others!
            </div>
            <span className="character-count">0/100</span>
            <textarea id="profile-editor-funFact" maxLength={100} />
          </div>
        </div>
        <div className="edit-profile-section-3">
          <div className="editor-input-item editor-input-textarea">
            <label>About You*</label>
            <div className="project-editor-extra-info">
              Share a brief overview of who you are, your interests, and what drives you!
            </div>
            <span className="character-count">0/2000</span>
            <textarea id="profile-editor-bio" maxLength={2000} />
          </div>
        </div>
      </div>
    );
  };