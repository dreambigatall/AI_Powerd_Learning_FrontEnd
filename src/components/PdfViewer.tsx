// // // src/components/PdfViewer.tsx
// // "use client";

// // import { useState } from 'react';
// // import { Document, Page, pdfjs } from 'react-pdf';
// // import { toast } from "sonner";
// // import { Button } from '@/components/ui/button';
// // import { Loader2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

// // // Set up the worker
// // // This path is relative to your `public` directory
// // pdfjs.GlobalWorkerOptions.workerSrc = `/pdf/pdf.worker.mjs`;

// // interface PdfViewerProps {
// //   fileUrl: string;
// // }

// // export default function PdfViewer({ fileUrl }: PdfViewerProps) {
// //   const [numPages, setNumPages] = useState<number>();
// //   const [pageNumber, setPageNumber] = useState<number>(1);
// //   const [scale, setScale] = useState(1.0);

// //   function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
// //     setNumPages(numPages);
// //   }

// //   function onDocumentLoadError(error: Error): void {
// //     toast.error(`Error loading PDF: ${error.message}`);
// //   }

// //   const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
// //   const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));

// //   return (
// //     <div className="w-full h-full flex flex-col bg-muted rounded-lg">
// //       {/* PDF Controls */}
// //       <div className="p-2 bg-background/50 backdrop-blur-sm border-b flex items-center justify-between sticky top-0 z-10">
// //         <div className="flex items-center gap-2">
// //           <Button variant="outline" size="icon" onClick={goToPrevPage} disabled={pageNumber <= 1}>
// //             <ChevronLeft className="h-4 w-4" />
// //           </Button>
// //           <p className="text-sm">
// //             Page {pageNumber} of {numPages || '--'}
// //           </p>
// //           <Button variant="outline" size="icon" onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)}>
// //             <ChevronRight className="h-4 w-4" />
// //           </Button>
// //         </div>
// //         <div className="flex items-center gap-2">
// //           <Button variant="outline" size="icon" onClick={() => setScale(s => s - 0.1)}><ZoomOut className="h-4 w-4" /></Button>
// //           <span className="text-sm">{(scale * 100).toFixed(0)}%</span>
// //           <Button variant="outline" size="icon" onClick={() => setScale(s => s + 0.1)}><ZoomIn className="h-4 w-4" /></Button>
// //         </div>
// //       </div>

// //       {/* PDF Document */}
// //       <div className="flex-grow overflow-auto">
// //         <Document
// //           file={fileUrl}
// //           onLoadSuccess={onDocumentLoadSuccess}
// //           onLoadError={onDocumentLoadError}
// //           loading={
// //             <div className="flex justify-center items-center h-full">
// //               <Loader2 className="h-6 w-6 animate-spin" />
// //             </div>
// //           }
// //         >
// //           <Page pageNumber={pageNumber} scale={scale} />
// //         </Document>
// //       </div>
// //     </div>
// //   );
// // }

// // src/components/PdfViewer.tsx
// "use client";

// import { useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import { toast } from "sonner";
// import { Button } from '@/components/ui/button';
// import { Loader2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

// // Set up the worker
// pdfjs.GlobalWorkerOptions.workerSrc = `/pdf/pdf.worker.mjs`;

// interface PdfViewerProps {
//   fileUrl: string;
// }

// export default function PdfViewer({ fileUrl }: PdfViewerProps) {
//   const [numPages, setNumPages] = useState<number>();
//   const [pageNumber, setPageNumber] = useState<number>(1);
//   const [scale, setScale] = useState(1.0);
//   const [isLoading, setIsLoading] = useState(true);
//   function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
//     setNumPages(numPages);
//     setIsLoading(false);
//   }

//   function onDocumentLoadError(error: Error): void {
//     toast.error(`Error loading PDF: ${error.message}`);
//     setIsLoading(false);
//   }

//   const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
//   const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));

//   return (
//     <div className="w-full h-full flex flex-col bg-muted rounded-lg">
//       {/* PDF Controls */}
//       <div className="p-2 bg-background/50 backdrop-blur-sm border-b flex items-center justify-between sticky top-0 z-10">
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="icon" onClick={goToPrevPage} disabled={pageNumber <= 1}>
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//           <p className="text-sm">
//             Page {pageNumber} of {numPages || '--'}
//           </p>
//           <Button variant="outline" size="icon" onClick={goToNextPage} disabled={pageNumber >= (numPages || 1)}>
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="outline" size="icon" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}><ZoomOut className="h-4 w-4" /></Button>
//           <span className="text-sm">{(scale * 100).toFixed(0)}%</span>
//           <Button variant="outline" size="icon" onClick={() => setScale(s => Math.min(2.0, s + 0.1))}><ZoomIn className="h-4 w-4" /></Button>
//         </div>
//       </div>

//       {/* PDF Document */}
//       <div className="flex-grow overflow-auto">
//         <Document
//           file={fileUrl}
//           onLoadSuccess={onDocumentLoadSuccess}
//           onLoadError={onDocumentLoadError}
//           loading={
//             <div className="flex justify-center items-center h-full">
//               <Loader2 className="h-6 w-6 animate-spin" />
//             </div>
//           }
//           // Add a class for styling the document container
//           className="flex justify-center"
//         >
//           <Page 
//             pageNumber={pageNumber} 
//             scale={scale} 
//             // Add a class for styling the page itself
//             className="shadow-lg"
//           />
//         </Document>
//       </div>
//     </div>
//   );
// }

// src/components/PdfViewer.tsx
"use client";

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Loader2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf/pdf.worker.mjs`;
//import { pdfjs } from 'react-pdf';

interface PdfViewerProps {
  fileUrl: string;
}

export default function PdfViewer({ fileUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error): void {
    toast.error(`Error loading PDF: ${error.message}`);
    setIsLoading(false);
  }

  const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || 1));

  return (
    <div className="w-full h-full flex flex-col bg-muted">
      <div className="p-2 bg-background/50 backdrop-blur-sm border-b flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevPage} disabled={pageNumber <= 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="text-sm">
            Page {pageNumber} of {numPages || '--'}
          </p>
          <Button variant="outline" size="icon" onClick={goToNextPage} disabled={!numPages || pageNumber >= numPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}><ZoomOut className="h-4 w-4" /></Button>
          <span className="text-sm">{(scale * 100).toFixed(0)}%</span>
          <Button variant="outline" size="icon" onClick={() => setScale(s => Math.min(2.5, s + 0.1))}><ZoomIn className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <div className={isLoading ? "w-full h-full flex justify-center items-center" : ""}>
          <Document
            key={fileUrl[1]}
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<Loader2 className="h-6 w-6 animate-spin" />}
            className={isLoading ? "hidden" : "flex justify-center"}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              className="shadow-lg"
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
      </div>
    </div>
  );
}