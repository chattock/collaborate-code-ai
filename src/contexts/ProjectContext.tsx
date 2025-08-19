import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cvFile, setCvFile] = useState<File | null>(null);
  
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

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : defaultProjects;
  });

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: Date.now().toString()
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...updatedProject } : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const reorderProjects = (startIndex: number, endIndex: number) => {
    setProjects(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      addProject,
      updateProject,
      deleteProject,
      reorderProjects,
      cvFile,
      setCvFile
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