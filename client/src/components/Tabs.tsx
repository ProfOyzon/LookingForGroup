import { act } from "react";

//add const [activeTab, setActiveTab] = useState(0); to the page then send those into the functions

//send in a list of names, 1 for each tab
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

//send in a list of react objects or a list of lists of react objects
//each list index corresponds to a tab button
export const TabContent = ({Children, activeTab}) =>{
  return (
    <div className="tabContent">
        {Children[activeTab]}
    </div>
  );
}