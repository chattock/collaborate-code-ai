import { Project } from '@/contexts/ProjectContext';
import { supabase } from '@/integrations/supabase/client';

export const migrateExistingReports = async (projects: Project[]): Promise<Project[]> => {
  const updatedProjects = [...projects];
  let hasChanges = false;

  for (let i = 0; i < updatedProjects.length; i++) {
    const project = updatedProjects[i];
    const updatedButtons = [...project.buttons];
    
    for (let j = 0; j < updatedButtons.length; j++) {
      const button = updatedButtons[j];
      
      // Only process report buttons that have placeholder URLs or no URLs
      if (button.type === 'report' && (button.url === '#' || !button.url)) {
        // For now, we'll just update the URL to be empty and add a placeholder fileName
        updatedButtons[j] = {
          ...button,
          url: '', // Clear placeholder URLs
          fileName: undefined // Ensure no fileName for placeholder reports
        };
        hasChanges = true;
      }
      
      // If a report has a real URL but no fileName, we could potentially extract the filename
      if (button.type === 'report' && button.url && button.url !== '#' && !button.url.startsWith('data:') && !button.fileName) {
        // Try to extract filename from URL
        const urlParts = button.url.split('/');
        const potentialFilename = urlParts[urlParts.length - 1];
        if (potentialFilename && potentialFilename.includes('.')) {
          updatedButtons[j] = {
            ...button,
            fileName: decodeURIComponent(potentialFilename)
          };
          hasChanges = true;
        }
      }
    }
    
    if (hasChanges) {
      updatedProjects[i] = {
        ...project,
        buttons: updatedButtons
      };
    }
  }

  return updatedProjects;
};

// Function to clean up any old base64 data from reports and convert to proper Supabase storage
export const cleanupReportData = async (projects: Project[]): Promise<Project[]> => {
  const updatedProjects = [...projects];
  
  for (let i = 0; i < updatedProjects.length; i++) {
    const project = updatedProjects[i];
    const updatedButtons = [...project.buttons];
    let hasChanges = false;
    
    for (let j = 0; j < updatedButtons.length; j++) {
      const button = updatedButtons[j];
      
      // Clean up any base64 data URLs that might be stored
      if (button.type === 'report' && button.url && button.url.startsWith('data:')) {
        console.log(`Cleaning up base64 data for project ${project.id}, button ${button.id}`);
        updatedButtons[j] = {
          ...button,
          url: '', // Remove base64 data
          fileName: button.fileName || undefined // Keep fileName if it exists
        };
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      updatedProjects[i] = {
        ...project,
        buttons: updatedButtons
      };
    }
  }
  
  return updatedProjects;
};