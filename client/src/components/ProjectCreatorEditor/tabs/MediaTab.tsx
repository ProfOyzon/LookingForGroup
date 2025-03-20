// --- Imports ---
import { useCallback, useEffect, useState } from "react";
import { ImageUploader } from "../../ImageUploader";

// --- Interfaces ---
interface ProjectData {
  title: string;
  hook: string;
  description: string;
  purpose: string;
  status: string;
  audience: string;
  project_types: { id: number; project_type: string }[];
  tags: { id: number; position: number; tag: string; type: string }[];
  jobs: { title_id: number; job_title: string; description: string; availability: string; location: string; duration: string; compensation: string }[];
  members: { first_name: string; last_name: string; job_title: string; profile_image: string; user_id: number }[];
  images: { id: number; image: string; position: number }[];
  socials: { id: number; url: string }[];
}

// --- Variables ---
// Default project value
const defaultProject: ProjectData = {
  title: '',
  hook: '',
  description: '',
  purpose: '',
  status: '',
  audience: '',
  project_types: [],
  tags: [],
  jobs: [],
  members: [],
  images: [],
  socials: []
};

// --- Methods ---
// Save image to modifiedProject
const updateImages = (modifiedProject, setModifiedProject, loadContent) => {
  // From ProfileEditPopup.tsx:60
  // const formElement = document.getElementById('profile-creator-editor') as HTMLFormElement;
  // sendFile(`/api/users/${userID}/profile-picture`, formElement);

  // get new image link
  const imageUploader = document.getElementById('image-uploader') as HTMLInputElement;
  if (imageUploader.files) {
    const imgLink = URL.createObjectURL(imageUploader.files[0]);

    // add to project images
    setModifiedProject({ ...modifiedProject,
      images: [...modifiedProject.images, { id: modifiedProject.images.length, image: imgLink, position: modifiedProject.images.length }]
    });

    // recreate HTML
    loadContent();
  }
  else {
    console.error('No image file found');
  }
};

// --- Component ---
export const MediaTab = ({ isNewProject = false, projectData = defaultProject, setProjectData }) => {

  // --- Hooks ---
  // tracking project modifications
  const [modifiedProject, setModifiedProject] = useState<ProjectData>(projectData);

  // Update data when data is changed
  useEffect(() => {
    setModifiedProject(projectData);
  }, [projectData]);

  // Update parent state when data is changed
  useEffect(() => {
    setProjectData(modifiedProject);
  }, [modifiedProject, setProjectData]);

  // Handle image upload
  const handleImageUpload = useCallback(() => {
    const imageUploader = document.getElementById('image-uploader') as HTMLInputElement;
    if (imageUploader && imageUploader.files && imageUploader.files.length > 0) {
      const imgLink = URL.createObjectURL(imageUploader.files[0]);

      // Add the new image to the project
      setModifiedProject({
        ...modifiedProject,
        images: [
          ...modifiedProject.images,
          { id: modifiedProject.images.length, image: imgLink, position: modifiedProject.images.length },
        ],
      });

      // // Remove image from uploader
      // imageUploader.style.backgroundImage = '';
    } else {
      console.error('No image file found');
    }
  }, [modifiedProject]);

  // --- Complete component ---
  return (
    <div id="project-editor-media">
      <label>Project Images</label>
      <div className="project-editor-extra-info">
        Upload images that showcase your project. Select one image to be used as the main
        thumbnail on the project's discover card.
      </div>
      <div id="project-editor-image-ui">
        {/* TODO: Add image elements/components here based on currently uploaded images */}
        {
          modifiedProject.images.map((image) => {
            let src;
            if (image.image.startsWith('blob')){
              // temporary image, not uploaded
              src = image.image;
            }
            else {
              src = `images/projects/${image.image}`;
            }
            return (
              <div className='project-editor-image-container'>
                <img src={src} alt="" />
              </div>
            );
          })
        }
        <div id="project-editor-add-image">
          <ImageUploader keepImage={false} callback={handleImageUpload}/>
        </div>
      </div>
    </div>
  );
};