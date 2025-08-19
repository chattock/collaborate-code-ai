import { GlobalWorkerOptions, getDocument, version } from 'pdfjs-dist';
import { supabase } from '@/integrations/supabase/client';

// Set up PDF.js worker - match the installed version
GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.mjs`;

export interface ConvertedDocument {
  originalUrl: string;
  imageUrl: string;
  fileName: string;
}

export const convertPDFToImage = async (file: File): Promise<Blob> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    
    // Get the first page
    const page = await pdf.getPage(1);
    
    // Set up canvas with good resolution
    const scale = 2; // Higher scale for better quality
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Render the page to canvas
    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas
    }).promise;
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, 'image/jpeg', 0.9);
    });
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    throw error;
  }
};

export const uploadCVWithImage = async (file: File): Promise<ConvertedDocument> => {
  try {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const timestamp = Date.now();
    
    // Upload original document
    const originalFileName = `cv-${timestamp}.${fileExtension}`;
    const { data: originalUpload, error: originalError } = await supabase.storage
      .from('project-files')
      .upload(`cv/${originalFileName}`, file, { upsert: true });

    if (originalError) throw originalError;

    const { data: { publicUrl: originalUrl } } = supabase.storage
      .from('project-files')
      .getPublicUrl(originalUpload.path);

    let imageUrl = originalUrl; // Fallback to original if conversion fails

    // Convert to image if it's a PDF
    if (fileExtension === 'pdf') {
      try {
        const imageBlob = await convertPDFToImage(file);
        const imageFileName = `cv-preview-${timestamp}.jpg`;
        
        const { data: imageUpload, error: imageError } = await supabase.storage
          .from('project-files')
          .upload(`cv/previews/${imageFileName}`, imageBlob, { upsert: true });

        if (imageError) throw imageError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-files')
          .getPublicUrl(imageUpload.path);
        
        imageUrl = publicUrl;
      } catch (conversionError) {
        console.warn('PDF conversion failed, using original:', conversionError);
      }
    }
    
    // For Word docs, we'll display a placeholder for now since browser conversion is complex
    if (fileExtension === 'doc' || fileExtension === 'docx') {
      // Create a simple preview image for Word documents
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create a simple document preview
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#333333';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Word Document', canvas.width / 2, 100);
        
        ctx.font = '16px Arial';
        ctx.fillText(file.name, canvas.width / 2, 140);
        
        ctx.fillStyle = '#666666';
        ctx.fillText('Preview not available', canvas.width / 2, 180);
        ctx.fillText('Click download to view full document', canvas.width / 2, 210);
        
        // Add some document-like lines
        ctx.strokeStyle = '#cccccc';
        for (let i = 250; i < 700; i += 30) {
          ctx.beginPath();
          ctx.moveTo(50, i);
          ctx.lineTo(550, i);
          ctx.stroke();
        }
        
        const previewBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create preview'));
          }, 'image/jpeg', 0.9);
        });
        
        const imageFileName = `cv-preview-${timestamp}.jpg`;
        const { data: imageUpload, error: imageError } = await supabase.storage
          .from('project-files')
          .upload(`cv/previews/${imageFileName}`, previewBlob, { upsert: true });

        if (!imageError && imageUpload) {
          const { data: { publicUrl } } = supabase.storage
            .from('project-files')
            .getPublicUrl(imageUpload.path);
          imageUrl = publicUrl;
        }
      }
    }

    return {
      originalUrl,
      imageUrl,
      fileName: file.name
    };
  } catch (error) {
    console.error('Error uploading CV with image:', error);
    throw error;
  }
};