import { useEffect, useRef } from 'react';
import { useAdminData } from '@/contexts/AdminDataContext';

// Type for save functions
export type SaveFunction = () => Promise<void>;

// Hook to register save functions with the admin context
export const useAdminSave = (saveFunction: SaveFunction, dependencies: any[] = []) => {
  const { markAsChanged } = useAdminData();
  const saveRef = useRef<SaveFunction>();
  
  // Update the save function reference
  useEffect(() => {
    saveRef.current = saveFunction;
  }, [saveFunction]);

  // Mark as changed when dependencies change
  useEffect(() => {
    if (dependencies.length > 0) {
      markAsChanged();
    }
  }, dependencies);

  // Register with global save registry
  useEffect(() => {
    const currentSave = saveRef.current;
    if (currentSave) {
      // Add to global registry
      if (!window.adminSaveFunctions) {
        window.adminSaveFunctions = new Set();
      }
      window.adminSaveFunctions.add(currentSave);

      return () => {
        // Cleanup
        if (window.adminSaveFunctions) {
          window.adminSaveFunctions.delete(currentSave);
        }
      };
    }
  }, []);

  return { markAsChanged };
};

// Declare global type
declare global {
  interface Window {
    adminSaveFunctions?: Set<SaveFunction>;
  }
}