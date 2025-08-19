-- Add introduction fields to projects table
ALTER TABLE public.projects 
ADD COLUMN introduction TEXT DEFAULT 'demo intro',
ADD COLUMN introduction_zh TEXT DEFAULT 'demo intro';

-- Update existing projects to have demo intro text
UPDATE public.projects 
SET introduction = 'demo intro', introduction_zh = 'demo intro' 
WHERE introduction IS NULL OR introduction_zh IS NULL;