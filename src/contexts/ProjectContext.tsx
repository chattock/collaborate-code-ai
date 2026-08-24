import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectButton {
  id: string;
  type: 'report' | 'website' | 'github' | 'video' | 'html';
  label: string;
  url?: string;
  fileName?: string;
}

export interface Project {
  id: string;
  title: string;
  titleZh: string;
  introduction: string;
  introductionZh: string;
  image: string;
  buttons: ProjectButton[];
}

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;
  hasUnsavedChanges: boolean;
  saveChanges: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Read-only load. Visitors never write to the database.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, title_zh, introduction, introduction_zh, image_url, buttons')
          .order('display_order', { ascending: true });

        if (error) throw error;
        if (cancelled) return;

        setProjects((data ?? []).map(p => ({
          id: p.id,
          title: p.title,
          titleZh: p.title_zh,
          introduction: p.introduction || '',
          introductionZh: p.introduction_zh || '',
          image: p.image_url || '',
          buttons: (p.buttons as unknown as ProjectButton[]) || [],
        })));
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Admin-only: persist the current project list, uploading any freshly
  // dropped images (data: URLs) to storage instead of writing base64 blobs
  // into the table.
  const saveChanges = async () => {
    const prepared: Project[] = [];
    for (const project of projects) {
      let imageUrl = project.image;
      if (imageUrl.startsWith('data:')) {
        const blob = await (await fetch(imageUrl)).blob();
        const ext = blob.type.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
        const filePath = `images/projects/${project.id}/project-${Date.now()}.${ext}`;
        const { data: uploaded, error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(filePath, blob, { upsert: true, contentType: blob.type });
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage.from('project-files').getPublicUrl(uploaded.path).data.publicUrl;
      }
      prepared.push({ ...project, image: imageUrl });
    }

    const rows = prepared.map((project, index) => ({
      id: project.id,
      title: project.title,
      title_zh: project.titleZh,
      introduction: project.introduction,
      introduction_zh: project.introductionZh,
      image_url: project.image,
      buttons: project.buttons,
      display_order: index,
    }));

    const { error: upsertError } = await supabase
      .from('projects')
      .upsert(rows, { onConflict: 'id' });
    if (upsertError) throw upsertError;

    // Remove rows that were deleted locally.
    if (rows.length > 0) {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .not('id', 'in', `(${rows.map(r => r.id).join(',')})`);
      if (deleteError) throw deleteError;
    } else {
      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (deleteError) throw deleteError;
    }

    setProjects(prepared);
    setHasUnsavedChanges(false);
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    setProjects(prev => [...prev, { ...project, id: crypto.randomUUID() }]);
    setHasUnsavedChanges(true);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(prev => prev.map(project =>
      project.id === id ? { ...project, ...updatedProject } : project
    ));
    setHasUnsavedChanges(true);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    setHasUnsavedChanges(true);
  };

  const reorderProjects = (startIndex: number, endIndex: number) => {
    setProjects(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
    setHasUnsavedChanges(true);
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      isLoading,
      addProject,
      updateProject,
      deleteProject,
      reorderProjects,
      hasUnsavedChanges,
      saveChanges,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
