// This component is used to create an array of string variables from user input
// Examples include tags and roles during project creation

import React, { useState } from "react";
import { hardSkills } from "../constants/skills";

export const ItemMaker = ({ type, grabber }) => {
    const [item, setItem] = useState("Full-stack Development");
    const [arr, setArr] = useState([""]);
    const [listObj, setObj] = useState(<div></div>);

    // Determined by "type" to provide either text or dropdown
    const createInput = () => {
        if (type == "role") {
            return (
                <select onChange = {
                    e => {setItem(e.target.value)}
                } id="e-maker-select">
                    {
                        hardSkills.map(s => {
                            return <option value={s}>{s}</option>
                        })
                    }
                </select>
            )
        }
        else {
            return <input type="text" onChange = {
                e => {setItem(e.target.value)}
            } id="e-maker-text"/>
        }
    }

    // Deletes the item from the array, and then sets the object with the new array
    // Does not work properly, deletes multiple items at once
    const deleteItem = (item) => {
        arr.splice(arr.indexOf(item, 1));
        setObj(
            <div>
                {arr.map((i) => {
                    return <p onClick={() => deleteItem(i)}>{i}</p>
                })}
            </div>
        )
    }

    return (
        <div>
            <div>
                {
                    listObj
                }
            </div>
            {createInput()}
            <button onClick={
                () => {
                    // Add current input to the array
                    arr.push(item);
                    grabber(arr);
                    setObj(
                        <div>
                            {arr.map((i) => {
                                // Makes the item into a page element, onClick runs deleteItem on the item
                                return <p onClick={() => deleteItem(i)}>{i}</p>
                            })}
                        </div>
                    )
                }
            } className="orange-button">Add</button>
            <button onClick={
                // Clear array and list
                () => {
                    setArr([]);
                    setObj(<div></div>)
                }
            } className="white-button">Clear</button>
        </div>
    )
}