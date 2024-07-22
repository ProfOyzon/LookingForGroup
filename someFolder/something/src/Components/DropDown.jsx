import React from 'react';
import '../Css/dropdown.css';

const DropDown = () => {
    return (
        <nav>
            <ul className="nav-list">
                <li className="dropdown">
                    <a>Projects</a>
                    <div className="dropdown-content">
                        <a href="#">Types of Projects</a>
                        <a href="#">Messaging system</a>
                    </div>
                </li>
                <li className="dropdown">
                    <a>Designers</a>
                    <div className="dropdown-content">
                        <a href="#">Types of Designers</a>
                        <a href="#">Skills</a>
                        <a href="#"></a>
                        <a href="#">Filler Item 4</a>
                    </div>
                </li>
                <li className="dropdown">
                    <a>Developers</a>
                    <div className="dropdown-content">
                        <a href="#">Filler Item 1</a>
                        <a href="#">Filler Item 2</a>
                        <a href="#">Filler Item 3</a>
                        <a href="#">Filler Item 4</a>
                    </div>
                </li>
                <li className="dropdown">
                    <a>Mentors</a>
                    <div className="dropdown-content">
                        <a href="#">Student</a>
                        <a href="#">How to apply</a>
                        <a href="#"></a>
                        <a href="#">Filler Item 4</a>
                    </div>
                </li>
            </ul>
        </nav>
    )
}

export default DropDown
