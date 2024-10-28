// PdfPreview.js
import React from "react";

const PdfPreview = ({ files }) => (
  <div className="pdf-preview">
    <h3>Files to Merge:</h3>
    {files.map((file, index) => (
      <div key={index} className="file-item">
        {file.name}
      </div>
    ))}
  </div>
);

export default PdfPreview;
