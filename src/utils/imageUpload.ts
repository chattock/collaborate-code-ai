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
    // For demo purposes, we'll return a placeholder URL
    // In a real scenario, you'd fetch the asset and upload it
    const fileName = assetPath.split('/').pop() || 'image.jpg';
    const publicUrl = `https://bfttasxtzlmnfwstxxkz.supabase.co/storage/v1/object/public/project-files/images/projects/${projectId}/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error('Error migrating asset:', error);
    return assetPath; // Fallback to original path
  }
};