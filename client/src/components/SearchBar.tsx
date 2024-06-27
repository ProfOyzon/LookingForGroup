import React from "react";
import { useState } from 'react';

import { ProjectCard } from "./ProjectCard";
import { projects } from "../constants/fakeData";

export const SearchBar = ({data, HandleChange}) => {

    let result;
    let placeholderText = "Search ";
    /* result = placeholderText.concat(data); */
    const [query, setQuery] = useState('');


    const HandleSearch = (data) => {
        setQuery(data.target.value);
    }

    const filteredSearch = projects.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    )

    return (
        <>
            <div className="search-wrapper">
                <form className="search-bar">
                    <button type="submit" className="search-button"><i className="fa fa-search"></i></button>
                    <input className="search-input" type="text" placeholder={result} onChange={HandleChange}></input>
                </form>
                 {/* {filteredSearch.map((project) => (
                    <ProjectCard project={project}></ProjectCard>
                ))} 
 */}
                
            </div>
        </>
    )
}