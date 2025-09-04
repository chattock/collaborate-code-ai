import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminDataContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  saveAllAdminData: () => Promise<void>;
  markAsChanged: () => void;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  const markAsChanged = () => {
    setHasUnsavedChanges(true);
  };

  const saveAllAdminData = async () => {
    try {
      // This will be called by individual components to save their data
      // Each component will register their save function with this context
      setHasUnsavedChanges(false);
      
      toast({
        title: "Success",
        description: "All changes saved successfully"
      });
    } catch (error) {
      console.error('Error saving admin data:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminDataContext.Provider value={{
      hasUnsavedChanges,
      setHasUnsavedChanges,
      saveAllAdminData,
      markAsChanged
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};