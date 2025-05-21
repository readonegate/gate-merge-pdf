
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import FileUpload from '@/components/SplitFileUpload';
import { Button } from '@/components/ui/button';
import { Loader2, FileMinus } from 'lucide-react';
import { splitPDF, downloadSplitPDF, getPDFPageCount } from '@/utils/pdfUtils';

const SplitPDF = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageRanges, setPageRanges] = useState<string>('');
  const [processing, setProcessing] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { toast } = useToast();

  const handleFileAdded = (newFile: File) => {
    setFile(newFile);
    // Reset page ranges when new file is added
    setPageRanges('');
    
    // Get total pages in the PDF
    getTotalPages(newFile);
  };

  const getTotalPages = async (file: File) => {
    try {
      const pages = await getPDFPageCount(file);
      setTotalPages(pages);
    } catch (error) {
      console.error('Error getting page count:', error);
      toast({
        title: "Error",
        description: "Gagal membaca jumlah halaman PDF",
        variant: "destructive"
      });
    }
  };

  const handleSplit = async () => {
    if (!file) {
      toast({
        title: "File tidak ditemukan",
        description: "Silakan upload file PDF terlebih dahulu.",
        variant: "destructive"
      });
      return;
    }

    if (!pageRanges.trim()) {
      toast({
        title: "Range halaman kosong",
        description: "Silakan tentukan range halaman yang ingin dipisahkan.",
        variant: "destructive"
      });
      return;
    }
    
    setProcessing(true);
    
    try {
      const splitPDFs = await splitPDF(file, pageRanges, totalPages);
      
      if (splitPDFs.length === 0) {
        throw new Error('Tidak ada PDF yang dihasilkan');
      }
      
      // If we have just one PDF, download it directly
      if (splitPDFs.length === 1) {
        downloadSplitPDF(splitPDFs[0].data, `${file.name.replace('.pdf', '')}_split.pdf`);
      } else {
        // Download multiple PDFs
        splitPDFs.forEach((pdf, index) => {
          downloadSplitPDF(pdf.data, `${file.name.replace('.pdf', '')}_${index + 1}.pdf`);
        });
      }
      
      toast({
        title: "Berhasil memisahkan PDF!",
        description: `${splitPDFs.length} file PDF telah dibuat dan diunduh.`,
      });
    } catch (error: any) {
      toast({
        title: "Gagal memisahkan PDF",
        description: error.message || "Terjadi kesalahan saat memisahkan file. Silakan coba lagi.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const isValidRanges = () => {
    if (!pageRanges.trim() || !totalPages) return false;
    
    // Simple validation - can be enhanced
    const rangePattern = /^(\d+(-\d+)?)(,\s*\d+(-\d+)?)*$/;
    
    return rangePattern.test(pageRanges);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="container py-8 flex-1">
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Pisahkan File PDF</h2>
            <p className="text-muted-foreground">
              Pisahkan halaman PDF menjadi beberapa file berdasarkan range halaman
            </p>
          </div>
          
          <FileUpload onFileAdded={handleFileAdded} />
          
          {file && (
            <div className="mt-6 border rounded-lg p-6 animate-fade-in">
              <h3 className="font-medium text-lg mb-4">
                {file.name} ({totalPages} halaman)
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="page-ranges" className="block text-sm font-medium mb-1">
                    Range Halaman
                  </label>
                  <input
                    id="page-ranges"
                    type="text"
                    placeholder="Contoh: 1-3,5,7-9"
                    className="w-full border rounded-md px-4 py-2 text-sm"
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Pisahkan dengan koma. Contoh: 1-3,5,7-9
                  </p>
                </div>
                
                <Button
                  onClick={handleSplit}
                  disabled={processing || !isValidRanges()}
                  className="px-6 w-full md:w-auto"
                  size="lg"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <FileMinus className="mr-2 h-4 w-4" />
                      Pisahkan PDF
                    </>
                  )}
                </Button>
              </div>
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

export default SplitPDF;
