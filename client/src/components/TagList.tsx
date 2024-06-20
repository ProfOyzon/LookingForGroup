import React from "react";
import { Tags } from "./Tags";

export const TagList = ({tagItems}) => {
    return (
        <div className="list">
            {tagItems.map(tag => (
                <Tags>{tag.skill}</Tags>
            ))}
        </div>
    )
  }