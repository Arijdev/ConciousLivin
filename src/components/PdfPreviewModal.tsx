'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  RotateCcw, 
  FileText,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface PdfPreviewModalProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
  onDownload: () => void;
  thumbnailUrls?: string[];
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({ 
  pdfUrl, 
  title, 
  onClose, 
  onDownload,
  thumbnailUrls = []
}) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<unknown>(null);

  const renderPage = async (pageNum: number) => {
    if (!pdfDocRef.current || rendering) return;
    
    setRendering(true);
    setLoading(true);
    
    try {
      const pdfDoc = pdfDocRef.current as { getPage: (n: number) => Promise<{ getViewport: (o: { scale: number }) => { width: number; height: number }; render: (o: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number }; canvas: HTMLCanvasElement }) => { promise: Promise<void> } }> };
      const page = await pdfDoc.getPage(pageNum);
      
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext('2d');
      if (!context) return;
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      }).promise;
      
      setPageNumber(pageNum);
    } catch (err) {
      console.error('Page render error:', err);
      setError('Failed to render page');
    } finally {
      setRendering(false);
      setLoading(false);
    }
  };

  const loadPdf = async () => {
    if (!pdfUrl) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      
      const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
      const pdfDoc = await loadingTask.promise;
      pdfDocRef.current = pdfDoc;
      setNumPages(pdfDoc.numPages);
      setPageNumber(1);
      await renderPage(1);
    } catch (err) {
      console.error('PDF load error:', err);
      setError('Failed to load PDF. The file may be corrupted or inaccessible.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl]);

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= numPages && pageNum !== pageNumber) {
      renderPage(pageNum);
    }
  };

  const zoomIn = () => {
    const newScale = Math.min(scale + 0.25, 3);
    setScale(newScale);
    renderPage(pageNumber);
  };

  const zoomOut = () => {
    const newScale = Math.max(scale - 0.25, 0.5);
    setScale(newScale);
    renderPage(pageNumber);
  };

  if (!pdfUrl) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E293B]">
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl p-8 max-w-md text-center">
          <FileText className="w-16 h-16 text-[#64748B] dark:text-[#94A3B8] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1E293B] dark:text-[#E2E8F0]">No PDF Available</h3>
          <p className="text-[#64748B] dark:text-[#94A3B8] mt-2">This resource doesn&apos;t have a PDF file attached.</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#115E59]"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/90 animate-fadeIn">
      <div className={`relative w-full h-full max-w-6xl max-h-[95vh] flex flex-col bg-white dark:bg-[#1E293B] rounded-2xl overflow-hidden ${isFullscreen ? 'fixed inset-0 max-w-full max-h-full rounded-none' : ''}`}>
        
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1E293B] text-white border-b border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-6 h-6 text-[#0F766E] dark:text-[#14B8A6]" />
            <h3 className="text-sm font-semibold truncate text-white">{title}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {!isFullscreen && (
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-2 rounded-lg bg-[#334155] hover:bg-[#334155] dark:hover:bg-[#0F172A] text-[#94A3B8] hover:text-white transition-colors"
                title="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            )}
            
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-lg bg-[#334155] hover:bg-[#334155] dark:hover:bg-[#0F172A] text-[#94A3B8] hover:text-white transition-colors"
                title="Exit Fullscreen"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={onDownload}
              className="p-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white transition-colors"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#334155] hover:bg-[#334155] dark:hover:bg-[#0F172A] text-[#94A3B8] hover:text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-4 py-2 bg-[#F1F5F9] dark:bg-[#1E293B] border-b border-[#E2E8F0] dark:border-[#334155] text-[#1E293B] dark:text-[#E2E8F0] text-sm text-center">
            {error}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Thumbnail Sidebar */}
          {(showThumbnails || thumbnailUrls.length > 0) && (
            <div className={`hidden lg:flex flex-col w-48 bg-[#F1F5F9] dark:bg-[#1E293B] border-r border-[#E2E8F0] dark:border-[#334155] transition-all duration-300 ${!showThumbnails ? 'w-0 overflow-hidden' : ''}`}>
              <div className="p-3 border-b border-[#E2E8F0] dark:border-[#334155] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1E293B] dark:text-[#E2E8F0]">Pages ({numPages})</span>
                <button
                  onClick={() => setShowThumbnails(false)}
                  className="p-2 rounded text-[#64748B] dark:text-[#94A3B8] hover:text-[#64748B] dark:hover:text-[#94A3B8]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {thumbnailUrls.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToPage(idx + 1)}
                    className={`w-full aspect-[3/4] rounded overflow-hidden border-2 transition-all ${
pageNumber === idx + 1 
? 'border-[#0F766E]' 
: 'border-transparent hover:border-[#E2E8F0] dark:hover:border-[#334155]'
}`}>
                    <Image src={thumb} alt={`Page ${idx + 1}`} fill sizes="120px" className="object-cover" />
                  </button>
                ))}
                {thumbnailUrls.length === 0 && numPages > 0 && (
                  <div className="space-y-2">
                    {Array.from({ length: numPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-full aspect-[3/4] rounded border-2 flex items-center justify-center bg-[#F1F5F9] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] text-xs font-normal transition-all ${
pageNumber === page 
? 'border-[#0F766E] bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6]' 
: 'border-transparent hover:border-[#E2E8F0] dark:hover:border-[#334155]'
}`}>
                        Page {page}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PDF Canvas Area */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-4 bg-[#F1F5F9] dark:bg-[#1E293B]">
            <div className="relative bg-white">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-4 border-[#0F766E] border-t-transparent rounded-full mx-auto" />
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Loading PDF...</p>
                  </div>
                </div>
              )}
              
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[80vh]"
                style={{ display: loading ? 'none' : 'block' }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#F1F5F9] dark:bg-[#1E293B] border-t border-[#E2E8F0] dark:border-[#334155]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(1)}
              disabled={pageNumber === 1 || loading}
              className="p-2 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] disabled:opacity-40 hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]"
              title="First Page"
            >
              <ChevronLeft className="w-5 h-5" />
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => goToPage(pageNumber - 1)}
              disabled={pageNumber === 1 || loading}
              className="p-2 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] disabled:opacity-40 hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]"
              title="Previous Page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="px-3 py-1.5 text-sm font-mono font-semibold text-[#1E293B] dark:text-[#E2E8F0] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-lg min-w-[80px] text-center">
              {pageNumber} / {numPages}
            </span>
            
            <button
              onClick={() => goToPage(pageNumber + 1)}
              disabled={pageNumber === numPages || loading}
              className="p-2 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] disabled:opacity-40 hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]"
              title="Next Page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => goToPage(numPages)}
              disabled={pageNumber === numPages || loading}
              className="p-2 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] disabled:opacity-40 hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]"
              title="Last Page"
            >
              <ChevronRight className="w-5 h-5" />
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5 || loading}
              className="p-2 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] disabled:opacity-40 hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            
            <span className="px-3 py-1.5 text-sm font-mono font-semibold text-[#1E293B] dark:text-[#E2E8F0] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-lg min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <button
              onClick={zoomIn}
              disabled={scale >= 3 || loading}
              className="p-2 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] disabled:opacity-40 hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setScale(1.5)}
              className="p-2 rounded-lg bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]"
              title="Reset Zoom"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`p-2 rounded-lg transition-colors ${showThumbnails ? 'bg-[#E6F4F1] dark:bg-[#134E4A] text-[#0F766E] dark:text-[#14B8A6]' : 'bg-white dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]'} border border-[#E2E8F0] dark:border-[#334155]`}
              title={showThumbnails ? 'Hide Thumbnails' : 'Show Thumbnails'}
            >
              <FileText className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const generateThumbnailFromPdf = async (pdfUrl: string, pageNumber: number = 1): Promise<string | null> => {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    
    const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
    const pdfDoc = await loadingTask.promise;
    
    if (pageNumber > pdfDoc.numPages) pageNumber = 1;
    
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 0.5 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return null;
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    }).promise;
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return null;
  }
};

export const generateAllThumbnailsFromPdf = async (pdfUrl: string): Promise<string[]> => {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    
    const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
    const pdfDoc = await loadingTask.promise;
    const thumbnails: string[] = [];
    
    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const thumb = await generateThumbnailFromPdf(pdfUrl, i);
      if (thumb) thumbnails.push(thumb);
    }
    
    return thumbnails;
  } catch (error) {
    console.error('All thumbnails generation error:', error);
    return [];
  }
};