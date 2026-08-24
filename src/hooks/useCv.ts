import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CvUrls {
  /** Image preview shown in the dialog (first page render for PDFs). */
  cvUrl: string | null;
  /** The original uploaded document, used for downloads. */
  cvOriginalUrl: string | null;
}

// Module-level cache so the hero dialog and the admin page share one fetch
// per session instead of hitting storage on every mount.
let cache: CvUrls | null = null;

export const invalidateCvCache = () => {
  cache = null;
};

const newestFile = (entries: { id: string | null; name: string; created_at: string | null }[] | null) =>
  (entries ?? [])
    .filter(f => f.id !== null) // drop folder rows (e.g. cv/previews)
    .sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))[0] ?? null;

const fetchCvUrls = async (): Promise<CvUrls> => {
  const [{ data: files }, { data: previews }] = await Promise.all([
    supabase.storage.from('project-files').list('cv/', { limit: 100 }),
    supabase.storage.from('project-files').list('cv/previews/', { limit: 100 }),
  ]);

  const original = newestFile(files);
  if (!original) return { cvUrl: null, cvOriginalUrl: null };

  const originalUrl = supabase.storage
    .from('project-files')
    .getPublicUrl(`cv/${original.name}`).data.publicUrl;

  const preview = newestFile(previews);
  const previewUrl = preview
    ? supabase.storage.from('project-files').getPublicUrl(`cv/previews/${preview.name}`).data.publicUrl
    : originalUrl;

  return { cvUrl: previewUrl, cvOriginalUrl: originalUrl };
};

/**
 * Lazily loads the CV from storage. Call `load()` when the CV is actually
 * needed (dialog opened, admin tab shown) — nothing is fetched on page load.
 */
export const useCv = () => {
  const [urls, setUrls] = useState<CvUrls>(cache ?? { cvUrl: null, cvOriginalUrl: null });
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(cache !== null);

  const load = useCallback(async (force = false) => {
    if (cache && !force) {
      setUrls(cache);
      setHasLoaded(true);
      return cache;
    }
    setIsLoading(true);
    try {
      const result = await fetchCvUrls();
      cache = result;
      setUrls(result);
      setHasLoaded(true);
      return result;
    } catch (error) {
      console.error('Error loading CV:', error);
      return { cvUrl: null, cvOriginalUrl: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { ...urls, isLoading, hasLoaded, load };
};
