import { supabase } from '@/integrations/supabase/client';

const CACHE_KEY = 'portfolio-favicon-url';

export const updateFaviconInDocument = (url: string) => {
  document.querySelectorAll("link[rel*='icon']").forEach(link => link.remove());
  const faviconLink = document.createElement('link');
  faviconLink.rel = 'icon';
  faviconLink.href = url;
  document.head.appendChild(faviconLink);
};

export const cacheFaviconUrl = (url: string) => {
  try {
    sessionStorage.setItem(CACHE_KEY, url);
  } catch {
    // ignore storage failures
  }
};

export const loadAndSetFavicon = async (): Promise<string | null> => {
  try {
    // Skip the storage round-trip on repeat loads within a session.
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      updateFaviconInDocument(cached);
      return cached;
    }
  } catch {
    // sessionStorage unavailable — fall through to fetching
  }

  try {
    const { data: files } = await supabase.storage
      .from('project-files')
      .list('favicon/', { limit: 1 });

    const file = files?.find(f => f.id !== null);
    if (file) {
      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(`favicon/${file.name}`);
      updateFaviconInDocument(publicUrl);
      cacheFaviconUrl(publicUrl);
      return publicUrl;
    }
  } catch (error) {
    console.error('Error loading favicon:', error);
  }
  return null;
};
