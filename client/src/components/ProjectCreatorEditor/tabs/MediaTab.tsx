// --- Imports ---
import { useCallback, useEffect, useState } from "react";
import { ImageUploader } from "../../ImageUploader";

// --- Interfaces ---
interface ProjectData {
  audience: string;
  description: string;
  hook: string;
  images: Image[];
  jobs: { title_id: number; job_title: string; description: string; availability: string; location: string; duration: string; compensation: string; }[];
  members: { first_name: string, last_name: string, job_title: string, profile_image: string, user_id: number}[];
  project_id: number;
  project_types: { id: number, project_type: string}[];
  purpose: string;
  socials: { id: number, url: string }[];
  status: string;
  tags: { id: number, position: number, tag: string, type: string}[];
  thumbnail: string;
  title: string;
}

// --- Variables ---
// Default project value
const defaultProject: ProjectData = {
  audience: '',
  description: '',
  hook: '',
  images: [],
  jobs: [],
  members: [],
  project_id: -1,
  project_types: [],
  purpose: '',
  socials: [],
  status: '',
  tags: [],
  thumbnail: '',
  title: '',
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
    console.log('data changes, new images', modifiedProject.images);
  }, [modifiedProject, setProjectData]);

  // Handle image upload
  const handleImageUpload = useCallback(() => {

    // Get file of uploaded image
    const formElement = document.getElementById('profile-creator-editor') as HTMLFormElement;
    console.log('formElement', formElement);

    // Get image in input element
    const imageUploader = document.getElementById('image-uploader') as HTMLInputElement;
    if (imageUploader && imageUploader.files && imageUploader.files.length > 0) {
      const imgLink = URL.createObjectURL(imageUploader.files[0]);

      // Add the new image to the project
      setModifiedProject({
        ...modifiedProject,
        images: [
          ...modifiedProject.images,
          { id: modifiedProject.images.length + 1, image: imgLink, position: modifiedProject.images.length + 1 },
        ],
      });
      
    } else {
      console.error('No image file found');
    }
  }, [modifiedProject]);

  // Handle image deletion
  const handleImageDelete = useCallback((id: number) => {
    //TODO: implement
  }, []);

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