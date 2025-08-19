import { supabase } from '@/integrations/supabase/client';

export const uploadReportFile = async (file: File, projectId: string, buttonId: string): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const timestamp = Date.now();
    const fileName = `report-${projectId}-${buttonId}-${timestamp}.${fileExtension}`;
    
    // Delete existing file if it exists
    const existingFiles = await supabase.storage
      .from('project-files')
      .list(`reports/${projectId}`, {
        search: `report-${projectId}-${buttonId}`
      });
    
    if (existingFiles.data && existingFiles.data.length > 0) {
      for (const existingFile of existingFiles.data) {
        await supabase.storage
          .from('project-files')
          .remove([`reports/${projectId}/${existingFile.name}`]);
      }
    }
    
    // Upload new file
    const { data, error } = await supabase.storage
      .from('project-files')
      .upload(`reports/${projectId}/${fileName}`, file, { 
        upsert: true,
        contentType: file.type
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('project-files')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading report file:', error);
    throw error;
  }
};

export const deleteReportFile = async (url: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const urlParts = url.split('/');
    const pathIndex = urlParts.findIndex(part => part === 'project-files');
    if (pathIndex === -1) return;
    
    const filePath = urlParts.slice(pathIndex + 1).join('/');
    
    const { error } = await supabase.storage
      .from('project-files')
      .remove([filePath]);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting report file:', error);
    // Don't throw here as it's not critical
  }
};