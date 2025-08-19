import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
export interface ProjectButton {
  id: string;
  type: 'report' | 'website' | 'github' | 'video';
  label: string;
  url?: string;
  file?: File;
}

export interface Project {
  id: string;
  title: string;
  titleZh: string;
  image: string;
  buttons: ProjectButton[];
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;
  cvFile: File | null;
  setCvFile: (file: File | null) => void;
  cvUrl: string | null;
  setCvUrl: (url: string | null) => void;
  cvOriginalUrl: string | null;
  setCvOriginalUrl: (url: string | null) => void;
  hasUnsavedChanges: boolean;
  saveChanges: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [cvOriginalUrl, setCvOriginalUrl] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const defaultProjects: Project[] = [
    {
      id: '1',
      title: 'UK Trade in 1700s',
      titleZh: '18世纪英国贸易',
      image: '/src/assets/project-uk-trade.jpg',
      buttons: [
        { id: '1-1', type: 'website', label: 'Website', url: 'https://chattock.github.io/Edmond/' },
        { id: '1-2', type: 'github', label: 'Github', url: 'https://github.com/chattock/Edmond' }
      ]
    },
    {
      id: '2',
      title: 'Word Relationship Project',
      titleZh: '词汇关系项目',
      image: '/src/assets/project-word-relations.jpg',
      buttons: [
        { id: '2-1', type: 'website', label: 'Website', url: 'https://chattock.github.io/Crisis/' },
        { id: '2-2', type: 'github', label: 'Github', url: 'https://github.com/chattock/Crisis' }
      ]
    },
    {
      id: '3',
      title: 'Global Temperatures',
      titleZh: '全球气温分析',
      image: '/src/assets/project-global-temps.jpg',
      buttons: [
        { id: '3-1', type: 'video', label: 'Video', url: 'https://www.youtube.com/watch?v=zUuyePLL3rw&t=165s' },
        { id: '3-2', type: 'report', label: 'Project', url: '#' },
        { id: '3-3', type: 'github', label: 'Github', url: 'https://github.com/chattock/data-vis-essay/blob/main/How%20to%20use%20CIMP6%20Databass-Copy1.ipynb' }
      ]
    },
    {
      id: '4',
      title: 'Battle of the Skies Demo',
      titleZh: '天空战争演示',
      image: '/src/assets/project-climate-mapping.jpg',
      buttons: [
        { id: '4-1', type: 'website', label: 'Website', url: 'https://chattock.github.io/climate-mapping/' },
        { id: '4-2', type: 'github', label: 'Github', url: 'https://github.com/chattock/climate-mapping' }
      ]
    },
    {
      id: '5',
      title: 'Orsted Project',
      titleZh: 'Ørsted金融分析',
      image: '/src/assets/project-orsted.jpg',
      buttons: [
        { id: '5-1', type: 'report', label: 'Report', url: '#' }
      ]
    },
    {
      id: '6',
      title: 'Fashion ESG Analysis',
      titleZh: '英国时尚ESG报告',
      image: '/src/assets/project-fashion-esg.jpg',
      buttons: [
        { id: '6-1', type: 'report', label: 'Report', url: '#' }
      ]
    },
    {
      id: '7',
      title: 'Chinese Development',
      titleZh: '中国在内罗毕的发展',
      image: '/src/assets/project-retail-analytics.jpg',
      buttons: [
        { id: '7-1', type: 'report', label: 'Report', url: '#' },
        { id: '7-2', type: 'website', label: 'Website', url: '#' }
      ]
    },
    {
      id: '8',
      title: 'California Fires',
      titleZh: '加州火灾预测',
      image: '/src/assets/project-ml-network.jpg',
      buttons: [
        { id: '8-1', type: 'report', label: 'Report', url: '#' },
        { id: '8-2', type: 'github', label: 'Github', url: '#' }
      ]
    },
    {
      id: '9',
      title: 'Glastonbury',
      titleZh: '格拉斯顿伯里音乐节经济评估',
      image: '/src/assets/project-property-analysis.jpg',
      buttons: [
        { id: '9-1', type: 'report', label: 'Report', url: '#' }
      ]
    },
    {
      id: '10',
      title: 'Gentrification',
      titleZh: '芝加哥中产阶级化驱动因素',
      image: '/src/assets/project-supply-chain.jpg',
      buttons: [
        { id: '10-1', type: 'website', label: 'Website', url: '#' }
      ]
    },
    {
      id: '11',
      title: 'Elizabeth Line',
      titleZh: '伊丽莎白线对房价的影响',
      image: '/src/assets/project-sentiment-analysis.jpg',
      buttons: [
        { id: '11-1', type: 'report', label: 'Report', url: '#' },
        { id: '11-2', type: 'website', label: 'Website', url: '#' }
      ]
    },
    {
      id: '12',
      title: 'Portfolio Optimizer',
      titleZh: '投资组合优化器',
      image: '/src/assets/project-portfolio-optimizer.jpg',
      buttons: [
        { id: '12-1', type: 'github', label: 'Github', url: '#' }
      ]
    }
  ];

  const [projects, setProjects] = useState<Project[]>([]);

  // Load projects and CV from Supabase on component mount
  useEffect(() => {
    console.log('ProjectProvider: Loading data from Supabase...');
    loadProjectsFromSupabase();
    loadCVFromSupabase();
    
    // Trigger image migration after initial load
    setTimeout(() => {
      import('@/utils/migrateProjectImages').catch(console.error);
    }, 2000);
  }, []);

  const loadProjectsFromSupabase = async () => {
    try {
      const { data: supabaseProjects, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      if (supabaseProjects && supabaseProjects.length > 0) {
        // Transform Supabase data to match our Project interface
        const transformedProjects = supabaseProjects.map(p => ({
          id: p.id,
          title: p.title,
          titleZh: p.title_zh,
          image: p.image_url || '',
          buttons: (p.buttons as unknown as ProjectButton[]) || []
        }));
        setProjects(transformedProjects);
      } else {
        // If no projects in Supabase, use defaults and save them
        setProjects(defaultProjects);
        await saveProjectsToSupabase(defaultProjects);
      }
    } catch (error) {
      console.error('Error loading projects from Supabase:', error);
      // Fallback to localStorage
      const saved = localStorage.getItem('projects');
      setProjects(saved ? JSON.parse(saved) : defaultProjects);
    }
  };

  const loadCVFromSupabase = async () => {
    try {
      // Load original CV file
      const { data: files } = await supabase.storage
        .from('project-files')
        .list('cv/', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      // Load preview image
      const { data: previewFiles } = await supabase.storage
        .from('project-files')
        .list('cv/previews/', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (files && files.length > 0) {
        const { data: { publicUrl: originalUrl } } = supabase.storage
          .from('project-files')
          .getPublicUrl(`cv/${files[0].name}`);
        
        setCvOriginalUrl(originalUrl);
        
        // Use preview image if available, otherwise use original
        if (previewFiles && previewFiles.length > 0) {
          const { data: { publicUrl: previewUrl } } = supabase.storage
            .from('project-files')
            .getPublicUrl(`cv/previews/${previewFiles[0].name}`);
          
          setCvUrl(previewUrl);
        } else {
          setCvUrl(originalUrl);
        }
        
        console.log('CV loaded - Original:', originalUrl, 'Preview:', previewFiles?.[0] ? 'exists' : 'none');
      } else {
        console.log('No CV files found in Supabase');
        setCvUrl(null);
        setCvOriginalUrl(null);
      }
    } catch (error) {
      console.error('Error loading CV from Supabase:', error);
      setCvUrl(null);
      setCvOriginalUrl(null);
    }
  };

  // Upload project images to Supabase and update image URLs
  const uploadProjectImagesAndUpdate = async (projectsToUpload: Project[]) => {
    const updatedProjects = [];
    
    for (const project of projectsToUpload) {
      let imageUrl = project.image;
      
      // If the image is a local asset path, upload it to Supabase
      if (project.image.startsWith('/src/assets/')) {
        try {
          const { migrateAssetToSupabase } = await import('@/utils/imageUpload');
          imageUrl = await migrateAssetToSupabase(project.image, project.id);
        } catch (error) {
          console.error(`Error uploading image for project ${project.id}:`, error);
          // Keep original path as fallback
        }
      }
      
      updatedProjects.push({
        ...project,
        image: imageUrl
      });
    }
    
    return updatedProjects;
  };

  const saveProjectsToSupabase = async (projectsToSave: Project[]) => {
    try {
      console.log('Starting to save projects to Supabase...', projectsToSave.length, 'projects');
      
      // Upload images and get updated project data
      const projectsWithImages = await uploadProjectImagesAndUpdate(projectsToSave);
      console.log('Images uploaded and processed');

      // Transform projects for Supabase and ensure valid UUIDs
      const supabaseProjects = projectsWithImages.map((project, index) => {
        let projectId = project.id;
        
        // If the ID is not a valid UUID, generate a new one
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(projectId)) {
          projectId = crypto.randomUUID();
        }
        
        return {
          id: projectId,
          title: project.title,
          title_zh: project.titleZh,
          image_url: project.image,
          buttons: project.buttons,
          display_order: index
        };
      });

      const idsToKeep = supabaseProjects.map(p => p.id);

      // Upsert new/updated projects
      const { error: upsertError } = await supabase
        .from('projects')
        .upsert(supabaseProjects, {
          onConflict: 'id',
          ignoreDuplicates: false
        });
      if (upsertError) throw upsertError;

      // Delete records that no longer exist locally
      if (idsToKeep.length > 0) {
        const idsParam = `(${idsToKeep.join(',')})`;
        const { error: deleteMissingError } = await supabase
          .from('projects')
          .delete()
          .not('id', 'in', idsParam);
        if (deleteMissingError) throw deleteMissingError;
      } else {
        // If no projects left, delete all
        const { error: deleteAllError } = await supabase
          .from('projects')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000');
        if (deleteAllError) throw deleteAllError;
      }

      console.log('Successfully saved projects to Supabase');
    } catch (error) {
      console.error('Error saving projects to Supabase:', error);
      throw error; // Re-throw instead of falling back to localStorage
    }
  };

  const saveCVToSupabase = async (file: File) => {
    try {
      // Delete existing CV files (both original and previews)
      const { data: existingFiles } = await supabase.storage
        .from('project-files')
        .list('cv/');

      if (existingFiles) {
        for (const existingFile of existingFiles) {
          await supabase.storage
            .from('project-files')
            .remove([`cv/${existingFile.name}`]);
        }
      }

      // Delete existing preview files
      const { data: existingPreviews } = await supabase.storage
        .from('project-files')
        .list('cv/previews/');

      if (existingPreviews) {
        for (const preview of existingPreviews) {
          await supabase.storage
            .from('project-files')
            .remove([`cv/previews/${preview.name}`]);
        }
      }

      // Use the new document converter
      const { uploadCVWithImage } = await import('@/utils/documentConverter');
      const result = await uploadCVWithImage(file);
      
      // Set both URLs - we'll use imageUrl for display, originalUrl for download
      setCvUrl(result.imageUrl);
      setCvOriginalUrl(result.originalUrl);
      
      return result.originalUrl;
    } catch (error) {
      console.error('Error saving CV to Supabase:', error);
      throw error;
    }
  };

  const saveChanges = async () => {
    try {
      console.log('Saving changes to Supabase...');
      
      // Save projects
      await saveProjectsToSupabase(projects);
      console.log('Projects saved successfully');
      
      // Save CV if there's one
      if (cvFile) {
        console.log('Uploading CV file:', cvFile.name);
        await saveCVToSupabase(cvFile);
        setCvFile(null); // Clear the file state after uploading
        console.log('CV uploaded and converted successfully');
      }
      
      setHasUnsavedChanges(false);
      console.log('All changes saved successfully');
    } catch (error) {
      console.error('Error saving changes:', error);
      throw error; // Re-throw to allow UI to handle the error
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    // Generate a proper UUID for the new project
    const uuid = crypto.randomUUID();
    
    const newProject = {
      ...project,
      id: uuid
    };
    setProjects(prev => [...prev, newProject]);
    setHasUnsavedChanges(true);
  };

  const updateProject = async (id: string, updatedProject: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...updatedProject } : project
    ));
    setHasUnsavedChanges(true);
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    setHasUnsavedChanges(true);
    console.log('Project deleted, hasUnsavedChanges set to true');
  };

  const reorderProjects = async (startIndex: number, endIndex: number) => {
    setProjects(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
    setHasUnsavedChanges(true);
    // Auto-save after reordering
    setTimeout(() => {
      saveChanges();
    }, 500);
  };

  const handleSetCvFile = async (file: File | null) => {
    if (file) {
      console.log('Processing CV file:', file.name);
      setCvFile(file);
      setHasUnsavedChanges(true); // Always show save button for user feedback
      
      // Convert and upload immediately for better UX
      try {
        console.log('Converting and uploading CV immediately...');
        const result = await saveCVToSupabase(file);
        setCvFile(null); // Clear the file state after successful upload
        console.log('CV processed successfully:', result);
        // Keep hasUnsavedChanges true so user can see the save button worked
      } catch (error) {
        console.error('Error processing CV immediately:', error);
        // Keep the file in state for manual save via Save All Changes button
      }
    } else {
      setCvFile(null);
      setCvUrl(null);
      setCvOriginalUrl(null);
      setHasUnsavedChanges(true); // Show save button when removing CV
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      addProject,
      updateProject,
      deleteProject,
      reorderProjects,
      cvFile,
      setCvFile: handleSetCvFile,
      cvUrl,
      setCvUrl,
      cvOriginalUrl,
      setCvOriginalUrl,
      hasUnsavedChanges,
      saveChanges
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    console.error('useProject called outside of ProjectProvider');
    console.trace('Call stack:');
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};