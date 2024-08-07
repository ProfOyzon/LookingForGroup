// This component is used to create an array of string variables from user input
// Examples include tags and roles during project creation

import React, { useState } from "react";
import { hardSkills } from "../constants/skills";

export const ItemMaker = ({ type, grabber }) => {
    const [item, setItem] = useState('');
    const [arr, setArr] = useState([""]);
    const [listObj, setObj] = useState(<div></div>);

    const createInput = () => {
        if (type == "role") {
            return (
                <select onChange={
                    e => { setItem(e.target.value) }
                }>
                    {
                        hardSkills.map(s => {
                            return <option value={s}>{s}</option>
                        })
                    }
                </select>
            )
        }
        else {
            return <input type="text" onChange={
                e => { setItem(e.target.value) }
            } />
        }
    }

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
                    arr.push(item);
                    grabber(arr);
                    setObj(
                        <div>
                            {arr.map((i) => {
                                return <p onClick={() => deleteItem(i)}>{i}</p>
                            })}
                        </div>
                    )
                }
            }>Add</button>
            <button onClick={
                () => {
                    setArr([]);
                    setObj(<div></div>)
                }
            }>Clear</button>
        </div>
    )
}