import './Styles/general.css';
import { useState, useEffect } from 'react';
import { sendPost } from '../functions/fetch';

const init = () => {
    // get all components
    const dropArea = document.getElementById('drop-area') as HTMLElement;
    const imageUploader = document.getElementById('image-uploader') as HTMLInputElement;
    const imageView = document.getElementById('img-view') as HTMLElement;

    const uploadImage = () => {
        // real-time update to view selected picture
        // Not for backend uploading
        let imgLink = URL.createObjectURL(imageUploader.files[0]);
        imageView.style.backgroundImage = `url(${imgLink})`;
        imageView.textContent = "";
        imageView.style.border = "";
    }

    imageUploader.addEventListener('change', uploadImage);

    dropArea.addEventListener('dragover', e => e.preventDefault());
    dropArea.addEventListener('drop', e => {
        e.preventDefault();
        imageUploader.files = e.dataTransfer.files;
        uploadImage();
    });
}

export const ImageUploader = () => {
    useEffect(()=>{
        init();
    }, []);
    return (
    <label htmlFor="image-uploader" id='drop-area'>
        <input type="file" name="image" id="image-uploader" accept="image/png, image/jpg" hidden />
        <div id='img-view'>
            <img src="assets/white/upload_image.png" />
            <p className="project-editor-extra-info">Drop your image here, or browse</p>
            <span className="project-editor-extra-info">Supports: JPEG, PNG</span>
        </div>
    </label>
    );
}