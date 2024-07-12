import React, { useState, useEffect } from 'react';
import '../Css/style.css';

export const Project = () => {
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [canProceed, setCanProceed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setCanProceed(selectedProjects.length >= 5);
    }, [selectedProjects]);

    const toggleButton = (buttonLabel) => {
        setSelectedProjects(prevState => {
            if (prevState.includes(buttonLabel)) {
                return prevState.filter(label => label !== buttonLabel);
            } else if (prevState.length < 5) {
                return [...prevState, buttonLabel];
            } else {
                return prevState;
            }
        });
    };

    const projects = [
        'Video Game', 'Mobile Development', 'Web Development',
        'Computer systems design', 'Software Development', 'Product Development',
        'Artificial Intelligence', 'IT Support and Administration', 'Data Science',
        'Cybersecurity', 'Cloud Computing', 'Animation',
        'Robotics'
    ];

    const filteredProjects = projects.filter(project =>
        project.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='flexColumn9'>
            <div className='flexRow11'>
                <h1>Select at least 5 Projects you would like to showcase</h1>
            </div>

            <div className='flexRow12'>
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />
                <div className='project-buttons-container'>
                    {filteredProjects.map(project => (
                        <button
                            key={project}
                            className="project-button"
                            onClick={() => toggleButton(project)}
                            style={{
                                backgroundColor: selectedProjects.includes(project) ? 'yellow' : 'white',
                                color: selectedProjects.includes(project) ? 'white' : 'black'
                            }}
                        >
                            {project}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flexFixedSection">
                <form className="stickySection">
                    <button className="button-sticky" type="button" onClick={() => window.location.href = '/PreviousSection'}>Back</button>
                    <button
                        className="button-sticky"
                        type="button"
                        onClick={() => window.location.href = '/NextSection'}
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

export default Project;