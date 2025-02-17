import { useState } from 'react';
import { Popup, PopupButton, PopupContent } from './Popup';
import { SearchBar } from './SearchBar';
import { ThemeIcon } from './ThemeIcon';
import * as tags from '../constants/tags'; // FIXME: use tags from db

// Has to be outside component to avoid getting reset on re-render
let activeTagFilters: string[] = [];

export const DiscoverFilters = ({ category, updateItemList }) => {
    // --------------------
    // Interfaces
    // --------------------
    interface Tag {
        tag: string;
        color: string;
    }

    // --------------------
    // Global variables
    // --------------------
    let currentTags, searchedTags, enabledFilters: Tag[];
    let setCurrentTags, setSearchedTags, setEnabledFilters: Function;
    [currentTags, setCurrentTags] = useState([]);
    [searchedTags, setSearchedTags] = useState({ 
        tags: [], 
        color: 'grey', 
    });
    [enabledFilters, setEnabledFilters] = useState([]);

    // Formatted for SearchBar dataSets prop
    const [dataSet, setDataSet] = useState([{ data: currentTags }]);

    const tagList = (category === 'projects') ? tags.tags : tags.peopleTags;

    // List of tabs for the filter popup to use, changes for discover/meet page
    // TO-DO: Change code to rely on Database
    let filterPopupTabs =
        (category === 'projects')
            ? [
                { categoryTags: tags.projectTypes, categoryName: 'Project Type', color: 'blue' },
                { categoryTags: tags.genres, categoryName: 'Genre', color: 'green' },
                { categoryTags: tags.purposes, categoryName: 'Purpose', color: 'grey' },
            ]
            : [
                { categoryTags: tags.devSkills, categoryName: 'Developer Skill', color: 'yellow' },
                { categoryTags: tags.desSkills, categoryName: 'Designer Skill', color: 'red' },
                { categoryTags: tags.softSkills, categoryName: 'Soft Skill', color: 'purple' },
                { categoryTags: tags.tags, categoryName: 'Role', color: 'grey' },
                { categoryTags: tags.tags, categoryName: 'Major', color: 'orange' },
            ]
        ;

    // --------------------
    // Helper functions
    // --------------------
    // Function called when a tag is clicked, adds tag to list of filters
    const toggleTag = (e, tagName: string) => {
        // Add tag if it isn't yet in the list
        if (!activeTagFilters.includes(tagName)) {
            activeTagFilters.push(tagName);
        } else {
            // Remove tag from the list
            activeTagFilters.splice(activeTagFilters.indexOf(tagName), 1);
        }

        // Toggle tag filter display and update panel display
        e.target.classList.toggle('discover-tag-filter-selected');
        updateItemList(activeTagFilters);
    }

    // Scrolls the list of tag filters right or left
    const scrollTags = (direction) => {
        // Check if left or right button was clicked
        let tagFilterElement = document.getElementById('discover-tag-filters')!;
        let leftScroll = document.getElementById('filters-left-scroll')!;
        let rightScroll = document.getElementById('filters-right-scroll')!;

        let scrollAmt = tagFilterElement.clientWidth;

        // Check if other button is hidden, if so...
        if (leftScroll.classList.contains('hide') || rightScroll.classList.contains('hide')) {
            // Un-hide the other scrolling button
            leftScroll.classList.remove('hide');
            rightScroll.classList.remove('hide');
        }

        // If we are going to hit the edge with this scroll...
        if (direction === 'left') {
            if ((tagFilterElement.scrollLeft - scrollAmt) <= 0) {
                leftScroll.classList.add('hide');
            }

            tagFilterElement.scrollBy(-scrollAmt, 0);
        } else if (direction === 'right') {
            let scrolledAmt = (tagFilterElement.scrollLeft + tagFilterElement.offsetWidth) + scrollAmt;
            if (scrolledAmt >= tagFilterElement.scrollWidth) {
                rightScroll.classList.add('hide');
            }

            tagFilterElement.scrollBy(scrollAmt, 0);
        }
    };

    // Ensures that scroll buttons show and hide when they're supposed to on-resize
    const resizeTagFilter = () => {
        let tagFilterElement = document.getElementById('discover-tag-filters')!;
        let leftScroll = document.getElementById('filters-left-scroll')!;
        let rightScroll = document.getElementById('filters-right-scroll')!;

        // Check if left scroll should be shown or hidden
        if (tagFilterElement.scrollLeft <= 0 && !leftScroll.classList.contains('hide')) {
            leftScroll.classList.add('hide');
        } else if (tagFilterElement.scrollLeft > 0 && leftScroll.classList.contains('hide')) {
            leftScroll.classList.remove('hide');
        }

        // Check if right scroll should be shown or hidden
        let scrollAmt = tagFilterElement.scrollLeft + tagFilterElement.offsetWidth;
        if (scrollAmt >= tagFilterElement.scrollWidth && !rightScroll.classList.contains('hide')) {
            rightScroll.classList.add('hide');
        } else if (scrollAmt < tagFilterElement.scrollWidth && rightScroll.classList.contains('hide')) {
            rightScroll.classList.remove('hide');
        }
    };

    // Variables for debouncing resize event call
    let timeout; // holder for timeout id
    let delay: number = 250; // delay after event is "complete" to run callback

    // window.resize event listener
    window.addEventListener('resize', function () {
        // clear the timeout
        clearTimeout(timeout);
        // start timing for event "completion"
        timeout = setTimeout(resizeTagFilter, delay);
    });

    // Checks if enabledFilters contains a particular tag
    const isTagEnabled = (tag, color) => {
        for (let i = 0; i < enabledFilters.length; i++) {
            if ((enabledFilters[i].tag === tag) && (enabledFilters[i].color === color)) {
                return i;
            }
        }

        return -1;
    }

    // Setup filter tabs when popup is opened
    const setupFilters = () => {
        // Defaults to the first available tab
        setCurrentTags(filterPopupTabs[0].categoryTags);
        setDataSet([{ data: filterPopupTabs[0].categoryTags }]);
        setSearchedTags({ 
            tags: filterPopupTabs[0].categoryTags, 
            color: filterPopupTabs[0].color 
        });
        setEnabledFilters([]);
    };

    // --------------------
    // Component
    // --------------------
    return (
        <div id='discover-filters'>
            <button
                id='filters-left-scroll'
                className='filters-scroller hide'
                onClick={() => scrollTags('left')}
            >
                <i className='fa fa-caret-left'></i>
            </button>
            <div id='discover-tag-filters' onResize={resizeTagFilter}>
                {tagList.map((tag) => (
                    <button
                        className='discover-tag-filter'
                        onClick={(e) => toggleTag(e, tag.toLowerCase())}
                    >
                        {tag}
                    </button>
                ))}
                {/* Container so more filters popup is aligned at the end */}
                <div id='discover-more-filters-container'>
                    {/* Additional filters popup */}
                    <Popup>
                        <PopupButton buttonId={'discover-more-filters'} callback={setupFilters}>
                            <ThemeIcon light={'assets/filters_light.png'} dark={'assets/filters_dark.png'} />
                        </PopupButton>
                        {/* 
                            When page loads, get all necessary tag lists based on page category.
                            Place these lists in an array, along with an identifier for which column 
                            they belong. Map through these lists to construct filter dropdown.
                            Displayed tags are determined using a state variable, changable w/ searchbar.
                            Tags have an onClick function that adds their tag to a full tag list. 
                            Full tag list is only applied when hitting done, which then pushes the 
                            info to an active list.
                        */}
                        <PopupContent useClose={false}>
                            { /* Back button */}
                            <PopupButton className='popup-back'>
                                <ThemeIcon
                                    light={'assets/back_light.png'}
                                    dark={'assets/back_dark.png'}
                                    id="dropdown-arrow"
                                />
                            </PopupButton>
                            <div id='filters-popup'>
                                <h2>{(category === 'projects') ? 'Project Filters' : 'People Filters'}</h2>
                                <div id="filters" className="popup-section">
                                    <SearchBar
                                        dataSets={dataSet}
                                        onSearch={(results) => {
                                            setSearchedTags({ tags: results[0], color: searchedTags.color });
                                        }}
                                    ></SearchBar>
                                    <div id="filter-tabs">
                                        {filterPopupTabs.map((tab, index) => (
                                            <a
                                                className={`filter-tab ${index === 0 ? 'selected' : ''}`}
                                                onClick={(e) => {
                                                    let element = e.target as HTMLElement;

                                                    // Remove .selected from all 3 options, add it only to current button
                                                    let tabs = document.querySelector('#filter-tabs')!.children;
                                                    for (let i = 0; i < tabs.length; i++) {
                                                        tabs[i].classList.remove('selected');
                                                    }
                                                    element.classList.add('selected');
                                                    setCurrentTags(tab.categoryTags);
                                                    setDataSet([{ data: tab.categoryTags }]);
                                                    setSearchedTags({ tags: tab.categoryTags, color: tab.color });
                                                }}
                                            >
                                                {tab.categoryName}
                                            </a>
                                        ))}
                                    </div>
                                    <hr />
                                    <div id="filter-tags">
                                        {searchedTags.tags.length === 0 ? (
                                            <p>No tags found. Please try a different search term.</p>
                                        ) : (
                                            searchedTags.tags.map((tag) => (
                                                <button
                                                    // className={`tag-button tag-button-${searchedTags.color}-unselected`}
                                                    className={`tag-button tag-button-${searchedTags.color}-${isTagEnabled(tag, searchedTags.color) !== -1 ? 'selected' : 'unselected'}`}
                                                    onClick={(e) => {
                                                        let element = e.target as HTMLElement;
                                                        let selecIndex = isTagEnabled(tag, searchedTags.color);

                                                        if (selecIndex === -1) {
                                                            // Creates an object to store text and category
                                                            //setEnabledFilters([...enabledFilters, { tag, color: searchedTags.color }]);
                                                            setEnabledFilters([
                                                                ...enabledFilters,
                                                                { tag, color: searchedTags.color },
                                                            ]);
                                                            element.classList.replace(
                                                                `tag-button-${searchedTags.color}-unselected`,
                                                                `tag-button-${searchedTags.color}-selected`
                                                            );
                                                        } else {
                                                            // Remove tag from list of enabled filters
                                                            setEnabledFilters(enabledFilters.toSpliced(selecIndex, 1));
                                                            element.classList.replace(
                                                                `tag-button-${searchedTags.color}-selected`,
                                                                `tag-button-${searchedTags.color}-unselected`
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <i
                                                        className={
                                                            isTagEnabled(tag, searchedTags.color) !== -1
                                                                ? 'fa fa-check'
                                                                : 'fa fa-plus'
                                                        }
                                                    ></i>
                                                    &nbsp;{tag}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div id="selected-section" className="popup-section">
                                    <h3>Selected</h3>
                                    <h4>Click to deselect</h4>
                                    <div id="selected-filters">
                                        {enabledFilters.map((tag) => (
                                            <button
                                                className={`tag-button tag-button-${tag.color}-selected`}
                                                onClick={(e) => {
                                                    // Remove tag from list of enabled filters, re-rendering component
                                                    setEnabledFilters(
                                                        enabledFilters.toSpliced(isTagEnabled(tag.tag, tag.color), 1)
                                                    );
                                                }}
                                            >
                                                <i className="fa fa-close"></i>
                                                &nbsp;{tag.tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <PopupButton
                                    buttonId={'primary-btn'}
                                    callback={() => {
                                        // Reset tag filters before adding results in
                                        activeTagFilters = [];
                                        const discoverFilters = document.getElementsByClassName('discover-tag-filter');

                                        for (let i = 0; i < enabledFilters.length; i++) {
                                            // Other from 'Projects' and Other from 'Genres' are treated the same when searching
                                            activeTagFilters.push(enabledFilters[i].tag.toLowerCase());

                                            // Check if any enabled filters matches a discover tag, and visually toggle it
                                            for (let j = 0; j < discoverFilters.length; j++) {
                                                if (
                                                    discoverFilters[j].innerHTML.toLowerCase() ===
                                                    enabledFilters[i].tag.toLowerCase()
                                                ) {
                                                    discoverFilters[j].classList.add('discover-tag-filter-selected');
                                                }
                                            }
                                        }

                                        // Update the project list
                                        updateItemList(activeTagFilters);
                                    }}
                                >
                                    Apply
                                </PopupButton>
                            </div>
                        </PopupContent>
                    </Popup>
                </div>
            </div>
            <button
                id='filters-right-scroll'
                className={`filters-scroller ${window.innerWidth >= 1450 ? 'hide' : ''}`}
                onClick={() => scrollTags('right')}
            >
                <i className='fa fa-caret-right'></i>
            </button>
        </div>
    );
};