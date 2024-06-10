import React, { useState, useEffect } from 'react';
import '../Css/style.css';

const Proficiencies = () => {
    const [selectedDesignerButtons, setSelectedDesignerButtons] = useState([]);
    const [selectedDeveloperButtons, setSelectedDeveloperButtons] = useState([]);
    const [selectedOtherButtons, setSelectedOtherButtons] = useState([]);
    const [canProceed, setCanProceed] = useState(false);

    useEffect(() => {
        const totalSelected = selectedDesignerButtons.length + selectedDeveloperButtons.length + selectedOtherButtons.length;
        setCanProceed(totalSelected === 3);
    }, [selectedDesignerButtons, selectedDeveloperButtons, selectedOtherButtons]);

    const toggleButton = (buttonLabel, category) => {
        if (category === 'Designer') {
            setSelectedDesignerButtons(prevState => {
                if (prevState.includes(buttonLabel)) {
                    return prevState.filter(label => label !== buttonLabel);
                } else if (prevState.length < 3) {
                    return [...prevState, buttonLabel];
                } else {
                    return prevState;
                }
            });
        } else if (category === 'Developer') {
            setSelectedDeveloperButtons(prevState => {
                if (prevState.includes(buttonLabel)) {
                    return prevState.filter(label => label !== buttonLabel);
                } else if (prevState.length < 3) {
                    return [...prevState, buttonLabel];
                } else {
                    return prevState;
                }
            });
        } else if (category === 'Other') {
            setSelectedOtherButtons(prevState => {
                if (prevState.includes(buttonLabel)) {
                    return prevState.filter(label => label !== buttonLabel);
                } else if (prevState.length < 3) {
                    return [...prevState, buttonLabel];
                } else {
                    return prevState;
                }
            });
        }
    };

    const designerButtons = [
        'UI/UX Designer', 'Graphic Designer', 'Web Designer', 'Technical Designer', 'Video Game Designer',
        'Product Designer', 'Visual Designer', 'Motion Graphic Designer', 'Packaging Designer',
        'Interior Designer', 'Motion Graphics Designer', 'Industrial Designer'
    ];

    const developerButtons = [
        'Full-stack Developer', 'Backend Developer', 'Front-end Developer', 'Software Developer', 'Cloud Developer',
        'Mobile Developer', 'Embedded Systems Developer', 'Game Developer', 'Database Developer', 'PHP Developer',
        'Blockchain Developer', 'DevOps Developer', 'AR/VR Developer'
    ];

    const otherButtons = [
        'Mentor', 'Video Editing', 'Manager', 'Project Management', 'Graphic Artist', 'Instructor', 'Sound Effect',
        'Marketing', 'Cyber Security', 'Web Editor', 'Digital Strategist', 'Technical Writer', 'IT'
    ];

    return (
        <div className="flexRowProfic">
            <div className="flexColumnProfic">
                <h1>Click on Three Proficiencies that interest you</h1>
            </div>

            <div className="flexRowButtons">
                <div id="Designer" className="designer-buttons">
                    {designerButtons.map(buttonLabel => (
                        <button
                            key={buttonLabel}
                            className="des-button"
                            onClick={() => toggleButton(buttonLabel, 'Designer')}
                            style={{
                                backgroundColor: selectedDesignerButtons.includes(buttonLabel) ? 'yellow' : 'white',
                                color: selectedDesignerButtons.includes(buttonLabel) ? 'white' : 'black'
                            }}
                        >
                            {buttonLabel}
                        </button>
                    ))}
                </div>

                <div id="Developers" className="developer-buttons">
                    {developerButtons.map(buttonLabel => (
                        <button
                            key={buttonLabel}
                            className="dev-button"
                            onClick={() => toggleButton(buttonLabel, 'Developer')}
                            style={{
                                backgroundColor: selectedDeveloperButtons.includes(buttonLabel) ? 'orange' : 'white',
                                color: selectedDeveloperButtons.includes(buttonLabel) ? 'white' : 'black'
                            }}
                        >
                            {buttonLabel}
                        </button>
                    ))}
                </div>

                <div id="Other" className="other-buttons">
                    {otherButtons.map(buttonLabel => (
                        <button
                            key={buttonLabel}
                            className="oth-button"
                            onClick={() => toggleButton(buttonLabel, 'Other')}
                            style={{
                                backgroundColor: selectedOtherButtons.includes(buttonLabel) ? 'grey' : 'white',
                                color: selectedOtherButtons.includes(buttonLabel) ? 'white' : 'black'
                            }}
                        >
                            {buttonLabel}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flexFixedSection">
                <form className="stickySection">
                    <button className="button-sticky" role="button" onClick={() => window.location.href = '/SignUp'}>Back</button>
                    <button
                        className="button-sticky"
                        role="button"
                        onClick={() => window.location.href = '/SoftHardSkills'}
                        disabled={!canProceed}
                        style={{ backgroundColor: canProceed ? 'orange' : 'grey', color: canProceed ? 'white' : 'black' }}
                    >
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Proficiencies;