import React, { useState, useEffect } from 'react';
import '../styles.css';

const Proficiencies = () => {
    const [selectedProfButtons, setSelectedProfButtons] = useState<string[]>([]);
    const [canProceed, setCanProceed] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        setCanProceed(selectedProfButtons.length >= 3);
    }, [selectedProfButtons]);

    const toggleButton = (buttonLabel: string) => {
        setSelectedProfButtons(prevState => {
            if (prevState.includes(buttonLabel)) {
                return prevState.filter(label => label !== buttonLabel);
            } else if (prevState.length < 3) {
                return [...prevState, buttonLabel];
            } else {
                return prevState;
            }
        });
    };

    const Prof = [
        "Full-stack Developer",
        "Backend Developer",
        "Front-end Developer",
        "Software Developer",
        "Cloud Developer",
        "Mobile Developer",
        "Game Developer",
        "Database Developer",
        "PHP Developer",
        "Blockchain Developer",
        "DevOps Developer",
        "AR/VR Developer",
        "UI/UX Designer",
        "Graphic Designer",
        "Web Designer",
        "Technical Designer",
        "Video Game Designer",
        "Product Designer",
        "Visual Designer",
        "Motion Graphic Designer",
        "Packaging Designer",
        "Interior Designer",
        "Motion Graphics Designer",
        "Industrial Designer",
        "Mentor",
        "Video Editing",
        "Manager",
        "Project Management",
        "Graphic Artist",
        "Instructor",
        "Sound Effect",
        "Marketing",
        "Cyber Security",
        "Web Editor",
        "Digital Strategist",
        "Technical Writer",
        "IT"
    ];

    const filteredProfs = Prof.filter(prof =>
        prof.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='flexColumn9'>
            <div className='flexContainer'>
                <div className='flexRow11'>
                    <h1>Select at least 3 Proficiencies you would like to show</h1>
                    <h4>You can add more or edit later</h4>
                </div>

                <div className='flexRow12'>
                    <input
                        type="text"
                        placeholder="Search Proficiencies"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-bar"
                    />
                    <div className='prof-buttons-container'>
                        {filteredProfs.map(prof => (
                            <button
                                key={prof}
                                className={`prof-button ${selectedProfButtons.includes(prof) ? 'selected' : ''}`}
                                onClick={() => toggleButton(prof)}
                            >
                                {prof}
                            </button>
                        ))}
                    </div>

                    <div className="stickySection">
                        <button className="button-sticky" type="button" onClick={() => window.location.href = '/SignUp'}>Back</button>
                        <button
                            className="button-sticky"
                            type="button"
                            onClick={() => window.location.href = '/HardSoftSkills'}
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

export default Proficiencies;