import { useState, useEffect } from 'react';
import { ProfileData } from '../ProfileEditPopup';
import { RoleSelector } from '../../RoleSelector';
import { MajorSelector } from '../../MajorSelector';
import { ImageUploader } from '../../ImageUploader';

const TextArea = (props: { title: string, description: string, count: number, maxLength: number, id: string }) => {
    const [wordCount, setWordCount] = useState(props.count);

    return (
        <div className="editor-input-item editor-input-textarea">
            <label>{props.title}</label>
            <div className="project-editor-extra-info">
                {props.description}
            </div>
            <span className="character-count">{wordCount}/{props.maxLength}</span>
            <textarea id={`profile-editor-${props.id}`} maxLength={props.maxLength} onChange={
                e => {
                    setWordCount(e.target.value.length);
                }
            }/>
        </div>
    );
}

export const AboutTab = (props: { profile: ProfileData, setUpInputs: Function }) => {
    // Effects
    useEffect(() => {
        const setUp = async () => {
            await props.setUpInputs(props.profile);
        }
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
                <TextArea 
                title={'Personal Quote'} 
                description={'Write a fun and catchy phrase that captures your unique personality!'} 
                count={props.profile.headline.length} 
                maxLength={100}
                id={'headline'}/>

                <TextArea 
                title={'Fun Fact'} 
                description={'Share a fun fact about yourself that will surprise others!'} 
                count={props.profile.fun_fact.length}
                maxLength={100}
                id={'funFact'} />
            </div>
            <div className="edit-profile-section-3">
                {/* <div className="editor-input-item editor-input-textarea">

                    <label>About You*</label>
                    <div className="project-editor-extra-info">
                        Share a brief overview of who you are, your interests, and what drives you!
                    </div>
                    <span className="character-count">0/2000</span>
                    <textarea id="profile-editor-bio" maxLength={2000} />
                </div> */}
                <TextArea 
                title={'About You*'} 
                description={'Share a brief overview of who you are, your interests, and what drives you!'} 
                count={props.profile.bio.length}
                maxLength={2000}
                id={'bio'} />
            </div>
        </div>
    );
};