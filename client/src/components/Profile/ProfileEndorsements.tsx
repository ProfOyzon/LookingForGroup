import { TabButton, TabContent } from "../Tabs";
import { Endorsement } from "../Endorsement";
import { useState } from "react";

export const ProfileEndorsements = ({user}) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section id = "profile-endorsements">
          <h2>Endorsements</h2>
          <div id = "profile-endorseList">
          {user.endorsements.map(endorsement => (
                <Endorsement endorsement={endorsement} endorsedID={user._id}></Endorsement>
            ))}
          </div>
        </section>
    );
}