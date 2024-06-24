import { act } from "react";

export const TabButton = ({names, activeTab, setActiveTab}) =>{
    return (
      <div className="tab__header">
      {names.map((name, index) => (
        <button className={`${index === activeTab && "active"} tab__button`} key={name} onClick={() => setActiveTab(index)}>
          {name}
        </button>
      ))}
    </div>
  );
}

export const TabContent = ({Children, activeTab}) =>{
  return (
    <div className="tabContent">
        {Children[activeTab]}
    </div>
  );
}