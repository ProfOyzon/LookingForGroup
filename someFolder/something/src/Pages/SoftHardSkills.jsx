import React, { useState, useEffect } from 'react';
import '../Css/style.css';

export const SoftHardSkills = () => {
    const [selectedskillButtons, setSelectedskillButtons] = useState([]);
    const [canProceed, setCanProceed] = useState(false);

    useEffect(() => {
        setCanProceed(selectedskillButtons.length === 5);
    }, [selectedskillButtons]);

    const toggleButton = (buttonLabel) => {
        setSelectedskillButtons(prevState => {
            if (prevState.includes(buttonLabel)) {
                return prevState.filter(label => label !== buttonLabel);
            } else if (prevState.length < 3) {
                return [...prevState, buttonLabel];
            } else {
                return prevState;
            }
        });
    };

    const skills = [
        'C++', 'CSS', 'C#',
        'Operating Systems', 'Linux', 'Windows',
        'Full-stack development', 'Java', 'Javascript',
        'SQL', 'Debugging', 'Visual Studio',
        'Visual Studio Code', 'Xcode', 'PyCharm',
        'Go', 'Microsoft Azure', 'API',
        'GitHub', 'Git', 'Ruby',
        'PHP', 'C', 'Kotlin',
        'Unity', 'Sketch', 'Figma',
        'Adobe', 'Adobe Photoshop', 'Canva',
        'Fotor', 'GIMP', 'Adobe XD',
        'Axure', 'Adobe Illustrator', 'Desygner',
        'Coolers', 'Pixlr', 'Visme',
        'Webflow', 'Blender', 'Procreate',
        'Autodesk Maya', 'Problem Solving', 'Creativity',
        'Leadership', 'Organization', 'Critical Thinking',
        'Public Speaking', 'Team Work', 'Interpersonal Communication',
        'Intrapersonal Communication', 'Innovation', 'Work Ethic',
        'Trustworthiness', 'Flexibility', 'Openness to Criticism',
        'Decision-making', 'Responsiveness', 'Curiosity',
        'Professionalism', 'Attention to Detail', 'Analytical Thinking',
        'Conflict Management', 'Fast Learner', 'Database Programming',
        'Organizational Skills', 'Data Structures and Algorithms', 'Time Management'
    ];

    return (
        <div className='flexColumn9'>
            <div className='flexRow11'>
                {/* You can put any content you want here */}
            </div>

            <div className='flexRow12'>
                {skills.map(skill => (
                    <button
                        key={skill}
                        className="skill-button"
                        onClick={() => toggleButton(skill)}
                        style={{
                            backgroundColor: selectedskillButtons.includes(skill) ? 'yellow' : 'white',
                            color: selectedskillButtons.includes(skill) ? 'white' : 'black'
                        }}
                    >
                        {skill}
                    </button>
                ))}
            </div>
            {/* You might want to display some message based on canProceed state */}
        </div>
    );
};

export default SoftHardSkills;