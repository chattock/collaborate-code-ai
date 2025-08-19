import { supabase } from '@/integrations/supabase/client';

export const uploadProjectImage = async (file: File, projectId: string): Promise<string> => {
  try {
    // Delete existing image for this project
    const { data: existingFiles } = await supabase.storage
      .from('project-files')
      .list(`images/projects/${projectId}/`);

    if (existingFiles && existingFiles.length > 0) {
      for (const existingFile of existingFiles) {
        await supabase.storage
          .from('project-files')
          .remove([`images/projects/${projectId}/${existingFile.name}`]);
      }
    }

    // Upload new image
    const fileExtension = file.name.split('.').pop();
    const fileName = `project-${Date.now()}.${fileExtension}`;
    const filePath = `images/projects/${projectId}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('project-files')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('project-files')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading project image:', error);
    throw error;
  }
};

// Upload existing asset images to Supabase
export const migrateAssetToSupabase = async (assetPath: string, projectId: string): Promise<string> => {
  try {
    // Extract filename from asset path
    const fileName = assetPath.split('/').pop() || 'image.jpg';
    const filePath = `images/projects/${projectId}/${fileName}`;
    
    // Check if file already exists
    const { data: existingFile } = await supabase.storage
      .from('project-files')
      .list(`images/projects/${projectId}/`, {
        search: fileName
      });
    
    if (existingFile && existingFile.length > 0) {
      // File already exists, return the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);
      return publicUrl;
    }
    
    // Fetch the local asset and convert to blob
    const response = await fetch(assetPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch asset: ${response.statusText}`);
    }
    const blob = await response.blob();
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('project-files')
      .upload(filePath, blob, {
        contentType: blob.type || 'image/jpeg',
        upsert: true
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('project-files')
      .getPublicUrl(data.path);
    
    console.log(`Uploaded ${fileName} to Supabase:`, publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error migrating asset:', error);
    return assetPath; // Fallback to original path
  }
};