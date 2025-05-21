
import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FileUp } from 'lucide-react';

interface FileUploadProps {
  onFilesAdded: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesAdded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const validateFiles = useCallback((files: File[]): File[] => {
    const validFiles = Array.from(files).filter(file => 
      file.type === 'application/pdf'
    );
    
    if (validFiles.length < files.length) {
      toast({
        title: "Hanya file PDF yang dapat diproses",
        description: "Beberapa file telah difilter.",
        variant: "destructive"
      });
    }
    
    return validFiles;
  }, [toast]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const validFiles = validateFiles(Array.from(e.dataTransfer.files));
      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
    }
  }, [onFilesAdded, validateFiles]);
  
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = validateFiles(Array.from(e.target.files));
      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
    }
  }, [onFilesAdded, validateFiles]);
  
  return (
    <div 
      className={`file-drop-area ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <FileUp className="h-10 w-10 text-muted-foreground mb-4 animate-bounce-limited" />
        <h3 className="text-lg font-medium mb-1">Tarik file PDF Anda ke sini</h3>
        <p className="text-muted-foreground mb-4">atau klik untuk memilih file</p>
        <label className="cursor-pointer bg-pdf hover:bg-pdf-hover text-white px-4 py-2 rounded-md transition-colors">
          Pilih File PDF
          <input 
            type="file" 
            multiple 
            accept=".pdf" 
            className="hidden" 
            onChange={handleFileInput} 
          />
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
