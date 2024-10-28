// UploadArea.js
import React from "react";

const UploadArea = ({ onFilesAdded }) => {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    onFilesAdded(files);
  };

  return (
    <div className="upload-area">
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <p>Drag & Drop your PDFs here</p>
        <p>or</p>
        <p>
          <b>Click to Upload</b>
        </p>
      </label>
    </div>
  );
};

export default UploadArea;
