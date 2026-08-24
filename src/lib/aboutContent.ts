import { supabase } from '@/integrations/supabase/client';

export interface AboutSectionContent {
  title: string;
  bullets?: string[];
  paragraphs?: string[];
}

export interface AboutContentRow {
  id: string;
  section: string;
  content: AboutSectionContent;
  content_zh: AboutSectionContent;
}

export const fetchAboutContent = async (): Promise<AboutContentRow[]> => {
  const { data, error } = await supabase
    .from('about_content')
    .select('id, section, content, content_zh');
  if (error) throw error;
  return (data ?? []) as unknown as AboutContentRow[];
};

/** Strip any manually typed leading bullet characters — the UI draws its own markers. */
export const cleanBullet = (text: string): string => text.replace(/^\s*[•·-]\s*/, '');
