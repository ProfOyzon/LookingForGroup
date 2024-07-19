import React, { useState } from "react";
import { ItemMaker } from "../ItemMaker";

const CreateProject = () => {
    const[pName, setName] = useState("");
    const[pDesc, setDesc] = useState("");
    const [tags, setTags] = useState(['']);
    const [roles, setRoles] = useState(['']);

    const grabTags = (grabbedTags:string[]) => {
        setTags(grabbedTags);
    }

    const grabRoles = (grabbedRoles:string[]) => {
        setRoles(grabbedRoles);
    }

    return(
        <div>
            <input type="text" onChange={
                (e) => {
                   setName(e.target.value);
                }
            } />
            <input type = "text" onChange={
                (e) => {
                    setDesc(e.target.value);
                }
            } />
            <ItemMaker type="tag" grabber = {grabTags}/>
            <ItemMaker type="role" grabber = {grabRoles} />
            <button onClick={
                ()=>{
                    const newProj = {
                        name: pName,
                        desc: pDesc,
                        tags: tags,
                        roles: roles
                    }
                    
                    // This will be database writing in the future
                    console.log(newProj);
                }
            }>Create</button>
        </div>
    )
}

export default CreateProject;