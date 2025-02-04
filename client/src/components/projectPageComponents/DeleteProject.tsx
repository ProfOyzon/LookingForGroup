import { Popup, PopupButton, PopupContent } from '../Popup';
import './projects.css'; // Ensure styles are applied

const DeleteProjectPopup = () => {
  return (
    <Popup>
      <PopupButton className="delete-project-button">Delete Project</PopupButton>
      <PopupContent>
        <div className="delete-popup-content">
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete this project? This action cannot be undone.</p>
          <div className="delete-popup-actions">
            <button className="project-delete-final">Delete</button>
            <button className="project-delete-cancel">Cancel</button>
          </div>
        </div>
      </PopupContent>
    </Popup>
  );
};

export default DeleteProjectPopup;
