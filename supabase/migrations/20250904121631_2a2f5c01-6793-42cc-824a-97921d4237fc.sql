-- Harden CMS tables: skills, about_content, projects

-- Ensure RLS is enabled
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- SKILLS: drop permissive write policy and add admin-only writes
DROP POLICY IF EXISTS "Authenticated users can manage skills" ON public.skills;

-- Keep or (re)create public read policy
DROP POLICY IF EXISTS "Anyone can view skills" ON public.skills;
CREATE POLICY "Anyone can view skills"
ON public.skills
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert skills"
ON public.skills
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update skills"
ON public.skills
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete skills"
ON public.skills
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ABOUT_CONTENT: drop permissive write policy and add admin-only writes
DROP POLICY IF EXISTS "Authenticated users can manage about content" ON public.about_content;

-- Keep or (re)create public read policy
DROP POLICY IF EXISTS "Anyone can view about content" ON public.about_content;
CREATE POLICY "Anyone can view about content"
ON public.about_content
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert about content"
ON public.about_content
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update about content"
ON public.about_content
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete about content"
ON public.about_content
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- PROJECTS: previously fully open; restrict writes to admins, reads public
DROP POLICY IF EXISTS "Allow all access to projects" ON public.projects;

CREATE POLICY "Anyone can view projects"
ON public.projects
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert projects"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects"
ON public.projects
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
