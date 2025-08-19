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
  hasUnsavedChanges: boolean;
  saveChanges: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState<string | null>(null);
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
    loadProjectsFromSupabase();
    loadCVFromSupabase();
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
      const { data: files } = await supabase.storage
        .from('project-files')
        .list('cv/', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (files && files.length > 0) {
        const { data: { publicUrl } } = supabase.storage
          .from('project-files')
          .getPublicUrl(`cv/${files[0].name}`);
        
        setCvUrl(publicUrl);
      }
    } catch (error) {
      console.error('Error loading CV from Supabase:', error);
    }
  };

  // Upload project images to Supabase and update image URLs
  const uploadProjectImagesAndUpdate = async (projectsToUpload: Project[]) => {
    const updatedProjects = [];
    
    for (const project of projectsToUpload) {
      let imageUrl = project.image;
      
      // If the image is a local asset path, we need to keep it as is for now
      // In production, these would be pre-uploaded to Supabase
      if (project.image.startsWith('/src/assets/')) {
        // Convert asset path to a Supabase-compatible URL
        const fileName = project.image.split('/').pop() || 'image.jpg';
        imageUrl = `https://bfttasxtzlmnfwstxxkz.supabase.co/storage/v1/object/public/project-files/images/projects/${project.id}/${fileName}`;
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
      // First, clear existing projects
      await supabase.from('projects').delete().neq('id', '');

      // Upload images and get updated project data
      const projectsWithImages = await uploadProjectImagesAndUpdate(projectsToSave);

      // Transform projects for Supabase
      const supabaseProjects = projectsWithImages.map((project, index) => ({
        id: project.id,
        title: project.title,
        title_zh: project.titleZh,
        image_url: project.image,
        buttons: project.buttons,
        display_order: index
      }));

      const { error } = await supabase
        .from('projects')
        .insert(supabaseProjects as any);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving projects to Supabase:', error);
      // Fallback to localStorage
      localStorage.setItem('projects', JSON.stringify(projectsToSave));
    }
  };

  const saveCVToSupabase = async (file: File) => {
    try {
      // Delete existing CV files
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

      // Upload new CV
      const fileName = `cv-${Date.now()}.${file.name.split('.').pop()}`;
      const { data, error } = await supabase.storage
        .from('project-files')
        .upload(`cv/${fileName}`, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(data.path);

      setCvUrl(publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error saving CV to Supabase:', error);
      throw error;
    }
  };

  const saveChanges = async () => {
    try {
      await saveProjectsToSupabase(projects);
      
      if (cvFile) {
        await saveCVToSupabase(cvFile);
        setCvFile(null); // Clear the file state after uploading
      }
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      // Fallback to localStorage for projects
      localStorage.setItem('projects', JSON.stringify(projects));
      setHasUnsavedChanges(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: Date.now().toString()
    };
    setProjects(prev => [...prev, newProject]);
    setHasUnsavedChanges(true);
  };

  const updateProject = async (id: string, updatedProject: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...updatedProject } : project
    ));
    setHasUnsavedChanges(true);
    // Auto-save after a short delay
    setTimeout(() => {
      if (hasUnsavedChanges) {
        saveChanges();
      }
    }, 1000);
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    setHasUnsavedChanges(true);
    // Auto-save immediately for deletes
    setTimeout(() => {
      saveChanges();
    }, 100);
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

  const handleSetCvFile = (file: File | null) => {
    setCvFile(file);
    if (file) {
      setHasUnsavedChanges(true);
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
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};