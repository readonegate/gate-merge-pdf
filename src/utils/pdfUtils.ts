import { PDFDocument } from 'pdf-lib';

export const mergePDFs = async (pdfFiles: File[]): Promise<Uint8Array> => {
  try {
    const mergedPdf = await PDFDocument.create();
    
    for (const pdfFile of pdfFiles) {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }
    
    return await mergedPdf.save();
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw new Error('Failed to merge PDFs');
  }
};

export const downloadMergedPDF = (pdfBytes: Uint8Array, filename: string = 'merged.pdf'): void => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getPDFPageCount = async (pdfFile: File): Promise<number> => {
  try {
    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    return pdfDoc.getPageCount();
  } catch (error) {
    console.error('Error counting PDF pages:', error);
    throw new Error('Failed to count PDF pages');
  }
};

export const splitPDF = async (
  pdfFile: File, 
  pageRangesStr: string,
  totalPages: number
): Promise<{ data: Uint8Array; range: string }[]> => {
  try {
    const pdfBytes = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Parse page ranges
    const pageRanges = parsePageRanges(pageRangesStr, totalPages);
    
    // Create separate PDFs for each range
    const splitDocs: { data: Uint8Array; range: string }[] = [];
    
    for (const range of pageRanges) {
      const newPdf = await PDFDocument.create();
      
      // Copy pages from original to new PDF
      const { start, end } = range;
      
      // PDF-lib uses 0-indexed pages, but user input is 1-indexed
      const pageIndexes = Array.from(
        { length: end - start + 1 },
        (_, i) => start - 1 + i
      );
      
      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndexes);
      copiedPages.forEach(page => {
        newPdf.addPage(page);
      });
      
      // Save the PDF
      const newPdfBytes = await newPdf.save();
      splitDocs.push({
        data: newPdfBytes,
        range: start === end ? `${start}` : `${start}-${end}`
      });
    }
    
    return splitDocs;
  } catch (error) {
    console.error('Error splitting PDF:', error);
    throw new Error('Failed to split PDF');
  }
};

export const downloadSplitPDF = (pdfBytes: Uint8Array, filename: string): void => {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function to parse page ranges from string like "1-3,5,7-9"
const parsePageRanges = (pageRangesStr: string, totalPages: number): { start: number; end: number }[] => {
  const ranges: { start: number; end: number }[] = [];
  
  // Split by comma
  const rangeStrings = pageRangesStr.split(',').map(s => s.trim());
  
  for (const rangeStr of rangeStrings) {
    if (rangeStr.includes('-')) {
      // Handle range like "1-3"
      const [startStr, endStr] = rangeStr.split('-');
      const start = Math.max(1, parseInt(startStr.trim(), 10));
      const end = Math.min(totalPages, parseInt(endStr.trim(), 10));
      
      // Validate the range
      if (isNaN(start) || isNaN(end) || start > end) {
        throw new Error(`Range tidak valid: ${rangeStr}`);
      }
      
      ranges.push({ start, end });
    } else {
      // Handle single page like "5"
      const page = parseInt(rangeStr.trim(), 10);
      
      // Validate the page
      if (isNaN(page) || page < 1 || page > totalPages) {
        throw new Error(`Halaman tidak valid: ${rangeStr}`);
      }
      
      ranges.push({ start: page, end: page });
    }
  }
  
  return ranges;
};
