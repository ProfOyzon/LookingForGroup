import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from "../constants/routes";
import { useSelector } from 'react-redux';

import { ProjectCard } from "./ProjectCard";
import { ProfileCard } from './ProfileCard';

const ProjectCarousel = ({selectedTab, projects, profiles}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const carouselInfiniteScroll = () => {
        if (selectedTab === 'Projects') {
            if (currentIndex === projects.length - 1) {
                return setCurrentIndex(0);
            }
            return setCurrentIndex(currentIndex + 1);
        }
        else {
            if (currentIndex === profiles.length - 1) {
                return setCurrentIndex(0);
            }
            return setCurrentIndex(currentIndex + 1);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            carouselInfiniteScroll();
        }, 5000);
        return () => clearInterval(interval);
    });

    if (selectedTab === 'Projects') {
        return (
            <div className='carousel-section'>
                <div className='carousel-container'>
                    {
                        projects.map((project) => {
                            return (
                                <h1 className='carousel-item' style={{transform: `translate(-${currentIndex * 100}%)`}} key={projects.indexOf(project)}>
                                    <ProjectCard project={project}></ProjectCard>
                                </h1>
                            );
                        })
                    }
                </div>
                <div className='carousel-pages'>
                    {
                        projects.map((project, index) => {
                            return (
                                <button className={`carousel-dot-${index}`} id={index == currentIndex ? 'current' : ''} key={index} onClick={() => setCurrentIndex(index)}>
                                    ⬤
                                </button>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
    else {
        return (
            <div className='carousel-section'>
                <div className='carousel-container'>
                    {
                        profiles.map((profile) => {
                            return (
                                <h1 className='carousel-item' style={{transform: `translate(-${currentIndex * 100}%)`}} key={profiles.indexOf(profile)}>
                                    <ProfileCard profile={profile}></ProfileCard>
                                </h1>
                            );
                        })
                    }
                </div>
                <div className='carousel-pages'>
                    {
                        profiles.map((profile, index) => {
                            return (
                                <button className={`carousel-dot-${index}`} id={index == currentIndex ? 'current' : ''} key={index} onClick={() => setCurrentIndex(index)}>
                                    ⬤
                                </button>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
};

export default ProjectCarousel;

// Coding Source: https://blog.bitsrc.io/simple-carousel-in-react-2aac73887243 
// •●⬤ 