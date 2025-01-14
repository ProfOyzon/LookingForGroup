import "./pages.css";
import { MessagesDisplay } from "../MessagesDisplay";
import { profiles } from "../../constants/fakeData"; // FIXME: use user data in db
import { useState } from "react";

//list of all the messages available to a user
const Messages = (props) => {
  const [uID, setUID] = useState(profiles[0]._id);

  return (
    <div>
      { /* User selection */}
      <select onChange={e => {
        setUID(Number(e.target.value));
      }}>
        {
          profiles.map(p => {
            return <option value={p._id}>{p.name}</option>
          })
        }
      </select>

      {/*list of message cards*/}
      <MessagesDisplay userID={uID}/>
    </div>
  );
}

export default Messages;