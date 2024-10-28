import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import UploadArea from "../components/UploadArea";
import PdfPreview from "../components/PdfPreview";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [mergedPdf, setMergedPdf] = useState(null);

  const handleFilesAdded = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const mergePdfs = async () => {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const pdfBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    setMergedPdf(
      URL.createObjectURL(
        new Blob([mergedPdfBytes], { type: "application/pdf" })
      )
    );
  };

  return (
    <div>
      <h1>Ridwan Gate Merge</h1>
      <h2>Merge PDF Files</h2>
      <UploadArea onFilesAdded={handleFilesAdded} />
      <PdfPreview files={files} />
      <button onClick={mergePdfs}>Merge PDFs</button>
      {mergedPdf && (
        <a href={mergedPdf} download="merged.pdf">
          Download Merged PDF
        </a>
      )}
    </div>
  );
};

export default Home;
