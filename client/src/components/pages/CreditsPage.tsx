import "./pages.css";
import "../Styles/styles.css";
import { useState } from 'react';

const Credits = (props) => {
    // THINGS TO DO:
    // ADD A LIST OF ALL OF US 
    // MAKE PAGE MOBILE FRIENDLY 
    // MAKE ACCESS TO PAGE MOBILE FRIENDLY 
    // MIGHT WANT TO RETOOL HOW THE TOGGLING OF THE CREDITS PAGE WORKS (MAYBE, IDK) 
    // MORE (PROBABLY) 

    // This is just here to create some placeholder text 
    let tempCredits = [`Jane Doe`, `Jane Doe`, `Jane Doe`, `Jane Doe`, `Jane Doe`, `Jane Doe`, `Jane Doe`, `Jane Doe`, `Jane Doe`, `Jane Doe`];

    return (
        <div>
            {tempCredits.map((e) => (
                <p>{e}</p>
            ))}
        </div>
    );
};

export default Credits;