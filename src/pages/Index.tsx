
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import FileList from '@/components/FileList';
import { Button } from '@/components/ui/button';
import { mergePDFs, downloadMergedPDF } from '@/utils/pdfUtils';
import { Loader2, FileText } from 'lucide-react';

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const { toast } = useToast();

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prev => {
      // Add only files that don't already exist (by name)
      const existingFileNames = prev.map(file => file.name);
      const filesToAdd = newFiles.filter(file => !existingFileNames.includes(file.name));
      
      if (filesToAdd.length < newFiles.length) {
        toast({
          title: "Beberapa file sudah ada",
          description: "File duplikat telah difilter.",
          variant: "default"
        });
      }
      
      return [...prev, ...filesToAdd];
    });
  };

  const handleFilesReordered = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleFileRemoved = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Minimal 2 file diperlukan",
        description: "Tambahkan setidaknya 2 file PDF untuk digabungkan.",
        variant: "destructive"
      });
      return;
    }
    
    setProcessing(true);
    
    try {
      const mergedPdfBytes = await mergePDFs(files);
      downloadMergedPDF(mergedPdfBytes, 'PDFTools-merged.pdf');
      
      toast({
        title: "Berhasil menggabungkan PDF!",
        description: "File PDF telah digabungkan dan diunduh.",
      });
    } catch (error) {
      toast({
        title: "Gagal menggabungkan PDF",
        description: "Terjadi kesalahan saat menggabungkan file. Silakan coba lagi.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="container py-8 flex-1">
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Gabungkan File PDF</h2>
            <p className="text-muted-foreground">
              Gabungkan beberapa file PDF menjadi satu dokumen dengan cepat dan mudah
            </p>
          </div>
          
          <FileUpload onFilesAdded={handleFilesAdded} />
          
          <FileList 
            files={files} 
            onFilesReordered={handleFilesReordered}
            onFileRemoved={handleFileRemoved}
          />
          
          {files.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleMerge}
                disabled={processing || files.length < 2}
                className="px-6"
                size="lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Gabungkan PDF
                  </>
                )}
              </Button>
            </div>
          )}
        </section>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} PDFTools — Utilitas PDF Online Gratis & Sederhana
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
