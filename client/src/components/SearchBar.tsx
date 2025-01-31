import React, { useEffect } from 'react';
import { useState } from 'react';

import { ProjectCard } from './ProjectCard';

export const SearchBar = ({ dataSets, onSearch }) => {
  let result;
  result = `Search`;

  // --- Searching ---
  /*const [query, setQuery] = useState('');

    useEffect(() => {
      const filteredResults = dataSets.map(dataSet =>
        dataSet.data.filter(item =>
          Object.values(item).some(value =>
            String(value).toLowerCase().includes(query.toLowerCase())
          )
        )
      );
      onSearch(filteredResults);
    }, [query, dataSets, onSearch]);

    const HandleChange = (event) => {
        setQuery(event.target.value);
    }*/

  const [query, setQuery] = useState('');

  const HandleChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    const filteredResults = dataSets.map((dataSet) =>
      dataSet.data.filter((item) => {
        // See if it's an array of objects, or just an array of strings
        if (typeof item === 'Object') {
          return Object.values(item).some((value) =>
            String(value).toLowerCase().includes(newQuery.toLowerCase())
          );
        }

        return String(item).toLowerCase().includes(newQuery.toLowerCase());
      })
    );
    onSearch(filteredResults);
  };

  return (
    <>
      <div className="search-wrapper">
        <form className="search-bar">
          <button type="submit" className="search-button">
            <i className="fa fa-search"></i>
          </button>
          <input
            className="search-input"
            type="text"
            placeholder={result}
            onChange={HandleChange}
          ></input>
        </form>
      </div>
    </>
  );
};
