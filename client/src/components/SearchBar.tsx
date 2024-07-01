import React, { useEffect } from "react";
import { useState } from 'react';

import { ProjectCard } from "./ProjectCard";
import { projects } from "../constants/fakeData";

export const SearchBar = ({ data, onSearch }) => {

    let result;
    let placeholderText = "Search ";
    /* result = placeholderText.concat(data); */

    // --- Searching ---
    const [query, setQuery] = useState('');

    useEffect(() => {
        const filteredData = data.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(query.toLowerCase())
          )
        );
        onSearch(filteredData);
      }, [query, data, onSearch]);

    const HandleChange = (event) => {
        setQuery(event.target.value);
    }

    /* let filteredSearch = data.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    ) */

return (
    <>
        <div className="search-wrapper">
            <form className="search-bar">
                <button type="submit" className="search-button"><i className="fa fa-search"></i></button>
                <input className="search-input" type="text" placeholder={result} onChange={HandleChange}></input>
            </form>
             
        </div>
    </>
)
}