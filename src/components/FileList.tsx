
import React, { useState, useEffect } from 'react';
import { File, Trash2, MoveUp, MoveDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileListProps {
  files: File[];
  onFilesReordered: (newFiles: File[]) => void;
  onFileRemoved: (index: number) => void;
}

const FileList: React.FC<FileListProps> = ({ 
  files, 
  onFilesReordered, 
  onFileRemoved 
}) => {
  const [fileItems, setFileItems] = useState<File[]>([]);
  
  useEffect(() => {
    setFileItems(files);
  }, [files]);
  
  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fileItems.length) return;
    
    const newFileItems = [...fileItems];
    const temp = newFileItems[index];
    newFileItems[index] = newFileItems[newIndex];
    newFileItems[newIndex] = temp;
    
    setFileItems(newFileItems);
    onFilesReordered(newFileItems);
  };
  
  if (files.length === 0) return null;
  
  return (
    <div className="mt-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5 text-pdf" />
          Susun PDF Anda
        </h3>
        <p className="text-sm text-muted-foreground">{files.length} file</p>
      </div>
      
      <div className="border rounded-lg divide-y">
        {fileItems.map((file, index) => (
          <div key={`${file.name}-${index}`} className="flex items-center justify-between p-4 sortable-item">
            <div className="flex items-center gap-3">
              <File className="h-5 w-5 text-pdf" />
              <span className="font-medium truncate max-w-[200px] sm:max-w-[300px] md:max-w-full">
                {file.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(0)} KB
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveFile(index, 'up')}
                disabled={index === 0}
                className="h-8 w-8"
              >
                <MoveUp className="h-4 w-4" />
                <span className="sr-only">Move up</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveFile(index, 'down')}
                disabled={index === fileItems.length - 1}
                className="h-8 w-8"
              >
                <MoveDown className="h-4 w-4" />
                <span className="sr-only">Move down</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFileRemoved(index)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
