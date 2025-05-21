
import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FileMinus } from 'lucide-react';

interface FileUploadProps {
  onFileAdded: (file: File) => void;
}

const SplitFileUpload: React.FC<FileUploadProps> = ({ onFileAdded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const validateFile = useCallback((file: File): boolean => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Hanya file PDF yang dapat diproses",
        description: "Silakan unggah file PDF saja.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  }, [toast]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]; // Take only the first file
      if (validateFile(file)) {
        onFileAdded(file);
      }
    }
  }, [onFileAdded, validateFile]);
  
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]; // Take only the first file
      if (validateFile(file)) {
        onFileAdded(file);
      }
    }
  }, [onFileAdded, validateFile]);
  
  return (
    <div 
      className={`file-drop-area ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <FileMinus className="h-10 w-10 text-muted-foreground mb-4 animate-bounce-limited" />
        <h3 className="text-lg font-medium mb-1">Tarik file PDF Anda ke sini</h3>
        <p className="text-muted-foreground mb-4">atau klik untuk memilih file</p>
        <label className="cursor-pointer bg-pdf hover:bg-pdf-hover text-white px-4 py-2 rounded-md transition-colors">
          Pilih File PDF
          <input 
            type="file"
            accept=".pdf" 
            className="hidden" 
            onChange={handleFileInput}
          />
        </label>
      </div>
    </div>
  );
};

export default SplitFileUpload;
