import React, { useState } from "react";
import styles from "./UploadMovie.module.css";

function UploadMovie({ onFileChange, onThumbnailChange }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "video/mp4") {
      setSelectedFile(file);
      onFileChange(file);
      alert(`File "${file.name}" selected successfully!`);
    } else {
      alert("Please select a valid MP4 file.");
    }
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedThumbnail(file);
      onThumbnailChange(file);
      alert(`Thumbnail "${file.name}" selected successfully!`);
    } else {
      alert("Please select a valid image file.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadContainer}>
        <label htmlFor="fileInput" className={styles.uploadButton}>
          <i className="bi bi-upload"></i> Attach Movie File
        </label>
        <input
          type="file"
          id="fileInput"
          accept="video/mp4"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
        {selectedFile && (
          <p className={styles.fileName}>Selected Movie: {selectedFile.name}</p>
        )}
      </div>
      <div className={styles.uploadContainer}>
        <label htmlFor="thumbnailInput" className={styles.uploadButton}>
          <i className="bi bi-upload"></i> Attach Thumbnail
        </label>
        <input
          type="file"
          id="thumbnailInput"
          accept="image/*"
          onChange={handleThumbnailChange}
          className={styles.fileInput}
        />
        {selectedThumbnail && (
          <p className={styles.fileName}>
            Selected Thumbnail: {selectedThumbnail.name}
          </p>
        )}
      </div>
    </div>
  );
}

export default UploadMovie;
