import React, { useState, useEffect } from 'react';
import '../styles.css';

const HardSoftSkills = () => {
    const [selectedSkillsButtons, setSelectedSkillsButtons] = useState<string[]>([]);
    const [canProceed, setCanProceed] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        setCanProceed(selectedSkillsButtons.length >= 5);
    }, [selectedSkillsButtons]);

    const toggleButton = (buttonLabel: string) => {
        setSelectedSkillsButtons(prevState => {
            if (prevState.includes(buttonLabel)) {
                return prevState.filter(label => label !== buttonLabel);
            } else if (prevState.length < 5) {
                return [...prevState, buttonLabel];
            } else {
                return prevState;
            }
        });
    };

    const Skills = [
        "Problem Solving", "Creativity", "Leadership", "Organization", "Critical Thinking",
        "Public Speaking", "Team Work", "Interpersonal communication", "Intrapersonal communication",
        "Innovation", "Work ethic", "Trustworthiness", "Flexibility", "Openness to criticism",
        "Decision-making", "Responsiveness", "Curiosity", "Professionalism", "Attention to detail",
        "Analytical thinking", "Conflict management", "Fast learner", "Database programming",
        "Organizational skills", "Data structures and algorithms", "Time management", "C++", "CSS",
        "C#", "Operating Systems", "Linux", "Windows", "Full-stack development", "Java", "Javascript",
        "SQL", "Debugging", "Visual Studio", "Visual Studio Code", "Xcode", "PyCharm", "Go",
        "Microsoft Azure", "API", "Github", "Git", "Ruby", "PHP", "C", "Kotlin", "Unity", "Sketch",
        "Figma", "Adobe", "Adobe Photoshop", "Canva", "Fotor", "GIMP", "Adobe XD", "Axure",
        "Adobe Illustrator", "Desygner", "Coolers", "Pixlr", "Visme", "Webflow", "Blender", "Procreate",
        "Autodesk Maya"
    ];

    const filteredSkills = Skills.filter(skill =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='flexColumn9'>
            <div className='flexContainer'>
                <div className='flexRow11'>
                    <h1>Select at least 5 Skills you would like to show</h1>
                    <h4>You can add more or edit later</h4>
                </div>

                <div className='flexRow12'>
                    <input
                        type="text"
                        placeholder="Search Skills"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-bar"
                    />
                    <div className='skills-buttons-container'>
                        {filteredSkills.map(skill => (
                            <button
                                key={skill}
                                className={`skill-button ${selectedSkillsButtons.includes(skill) ? 'selected' : ''}`}
                                onClick={() => toggleButton(skill)}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>

                    <div className="stickySection">
                        <button className="button-sticky" type="button" onClick={() => window.location.href = '/HardSoftSkills'}>Back</button>
                        <button
                            className="button-sticky"
                            type="button"
                            onClick={() => window.location.href = '/'}
                            disabled={!canProceed}
                            style={{ backgroundColor: canProceed ? 'orange' : 'grey', color: 'white' }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HardSoftSkills;