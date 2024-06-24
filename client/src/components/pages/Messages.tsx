import "./pages.css";
import { MessagesDisplay } from "../MessagesDisplay";
import { profiles } from "../../constants/fakeData";
import { useState } from "react";

const Messages = (props) => {
  const [uID, setUID] = useState(profiles[0]._id);

  return (
    <div>
      <select onChange={e => {
        setUID(Number(e.target.value));
      }}>
        {
          profiles.map(p => {
            return <option value={p._id}>{p.name}</option>
          })
        }
      </select>

      <MessagesDisplay userID={uID}/>
    </div>
  );
}

export default Messages;