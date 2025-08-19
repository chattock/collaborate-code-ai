import { migrateAssetToSupabase } from './imageUpload';
import { supabase } from '@/integrations/supabase/client';

// Function to migrate all existing project images to Supabase
export const migrateAllProjectImages = async () => {
  try {
    // Get all projects from Supabase
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*');

    if (error) throw error;

    if (!projects || projects.length === 0) {
      console.log('No projects found to migrate');
      return;
    }

    console.log(`Found ${projects.length} projects to migrate images for`);

    // Update each project with Supabase image URLs
    for (const project of projects) {
      if (project.image_url && project.image_url.startsWith('/src/assets/')) {
        console.log(`Migrating image for project: ${project.title}`);
        
        try {
          const newImageUrl = await migrateAssetToSupabase(project.image_url, project.id);
          
          // Update the project in Supabase with the new image URL
          const { error: updateError } = await supabase
            .from('projects')
            .update({ image_url: newImageUrl })
            .eq('id', project.id);

          if (updateError) {
            console.error(`Error updating project ${project.id}:`, updateError);
          } else {
            console.log(`Successfully migrated image for project: ${project.title}`);
          }
        } catch (imageError) {
          console.error(`Error migrating image for project ${project.id}:`, imageError);
        }
      }
    }

    console.log('Migration complete');
  } catch (error) {
    console.error('Error during migration:', error);
  }
};

// Auto-run migration when this module is imported
if (typeof window !== 'undefined') {
  // Only run in browser environment
  migrateAllProjectImages().catch(console.error);
}