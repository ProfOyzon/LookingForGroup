import { TabButton, TabContent } from "../Tabs";
import { Endorsement } from "../Endorsement";
import { useState } from "react";

export const ProfileEndorsements = ({user}) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="profile-section" id = "profile-endorsements">
            <h2>Endorsements</h2>
            <div id = "tabList" className="list">
            <TabButton names = {getSkillNames(user.skills.filter(skill => skill.endorsed))} activeTab={activeTab} setActiveTab={setActiveTab}></TabButton>
            </div>
            <div id = "textList">
            <TabContent Children={getChildrenList(user.skills.filter(skill => skill.endorsed))} activeTab={activeTab}></TabContent>
            </div>
        </section>
    );

    function getSkillNames(skillList) {
        let names : string[] = [];
        for (let skill of skillList){
          names.push(skill.skill);
        }
        return names;
      }
      
      function getChildrenList (skillList) {
        let endorsements : Object[] = [];
        for (let skill of skillList){
          endorsements.push(skill.endorsements.map(endorsement =><Endorsement endorsement={endorsement}></Endorsement>))
        }
        return endorsements;
      }
}