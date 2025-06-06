import './Styles/general.css';
import './Styles/imageUploader.css';
import { useEffect } from 'react';
import { sendPost } from '../functions/fetch'; //Not fixing, is this something to be implemented later?

let dropArea: HTMLElement;
let imageView: HTMLElement;
let imageUploader: HTMLInputElement;

const uploadImageFile = (keepImage: boolean) => {
  console.log(imageUploader.files[0]);
  if (!imageUploader.files || imageUploader.files.length === 0 || imageUploader.files[0] == undefined) {
    return;
  }
  const imgLink = URL.createObjectURL(imageUploader.files[0]);
  if (keepImage) {

    // Response for whether file was of the right type
    if (imageUploader.files[0].type == "image/png" || imageUploader.files[0].type == "image/jpeg") {
      uploadImage(imgLink);
    }
    else {
      // This can be replaced with prettier error handling if wanted
      alert("File type not supported: Please use .PNG or .JPG");
    }
  }
};

export const uploadImage = (url: string) => {
  imageView.style.backgroundImage = `url(${url})`;
  imageView.textContent = '';
  imageView.innerHTML = `<img class="bottom-right" src="assets/white/upload_image.png" />`;
  imageView.style.border = '';
};

const init = (keepImage: boolean) => {
  dropArea = document.getElementById('drop-area') as HTMLElement;
  imageUploader = document.getElementById('image-uploader') as HTMLInputElement;
  imageView = document.getElementById('img-view') as HTMLElement;

  // Wrap event listeners to pass correct parameters
  imageUploader.addEventListener('change', () => uploadImageFile(keepImage));

  dropArea.addEventListener('dragover', (e) => e.preventDefault());
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault();

    if (e.dataTransfer && e.dataTransfer.files) {
      imageUploader.files = e.dataTransfer.files;
      uploadImageFile(keepImage);
    }
  });
};

export const ImageUploader = ({
  keepImage = true,
  callback = () => { },
}) => {
  useEffect(() => {
    init(keepImage);
  }, []);

  return (
    <label htmlFor="image-uploader" id="drop-area">
      <input
        type="file"
        name="image"
        id="image-uploader"
        multiple accept=".png, .jpg"
        onChange={callback}
        hidden
      />
      <div id="img-view">
        <img src="assets/white/upload_image.png" />
        <p className="project-editor-extra-info">Drop your image here, or browse</p>
        <span className="project-editor-extra-info">Supports: JPEG, PNG</span>
      </div>
    </label>
  );
};
