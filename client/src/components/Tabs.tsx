import { act } from "react";

//a multi-use tabs component

//add const [activeTab, setActiveTab] = useState(0); to the page then send those into the functions

//send in a list of names, 1 for each tab
export const TabButton = ({names, activeTab, setActiveTab}) =>{
    return (
      <div className="tab-header">
      {names.map((name, index) => (
        <button className={`${index === activeTab && "active"} tab-button`} key={name} onClick={() => setActiveTab(index)}>
          {name}
        </button>
      ))}
    </div>
  );
}

//send in a list of react objects or a list of lists of react objects
//each list index corresponds to a tab button
export const TabContent = ({Children, activeTab}) =>{
  return (
    <div className="tab-content">
        {Children[activeTab]}
    </div>
  );
}