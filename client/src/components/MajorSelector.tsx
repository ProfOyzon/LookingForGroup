//Styles
import './Styles/credits.css';
import './Styles/discoverMeet.css';
import './Styles/emailConfirmation.css';
import './Styles/general.css';
import './Styles/loginSignup.css';
import './Styles/messages.css';
import './Styles/notification.css';
import './Styles/profile.css';
import './Styles/projects.css';
import './Styles/settings.css';
import './Styles/pages.css';

import { useState, useEffect } from 'react';

const getMajors = async () => {
    // TODO: create error handling, try catch block
    const response = await fetch('/api/datasets/majors');
    const {data} = await response.json();
    // console.log(data);
    return data;
}

export const MajorSelector = () => {
    const [options, setOptions] = useState(null);

    useEffect(
        () => {
            const setUpRoleSelector = async () => {
                const jobTitles = await getMajors();
                const selectorOptions = jobTitles.map( (job) => {
                    return <option value={job.major_id}>{job.label}</option>;
                });
                setOptions(selectorOptions); 
            }
            setUpRoleSelector();
        }, []
    );

    return (
        <div className="editor-input-item">
            <label>Major*</label>
            {/* <br /> */}
            <select id="profile-editor-role">
                {options}
            </select>
        </div>
    );
}