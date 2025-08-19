import { supabase } from '@/integrations/supabase/client';

export const loadAndSetFavicon = async () => {
  try {
    const { data: files } = await supabase.storage
      .from('project-files')
      .list('favicon/');

    if (files && files.length > 0) {
      // Get the first favicon file
      const faviconFile = files[0];
      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(`favicon/${faviconFile.name}`);
      
      // Update favicon in document
      updateFaviconInDocument(publicUrl);
      return publicUrl;
    }
  } catch (error) {
    console.error('Error loading favicon:', error);
  }
  return null;
};

const updateFaviconInDocument = (url: string) => {
  // Remove all existing favicon links
  const existingFavicons = document.querySelectorAll("link[rel*='icon']");
  existingFavicons.forEach(link => link.remove());
  
  // Create new favicon link
  const faviconLink = document.createElement('link');
  faviconLink.rel = 'icon';
  faviconLink.href = url;
  faviconLink.type = 'image/png';
  document.head.appendChild(faviconLink);
  
  // Force browser to reload favicon by appending timestamp
  const timestamp = new Date().getTime();
  faviconLink.href = `${url}?t=${timestamp}`;
};