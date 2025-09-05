import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AdminContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: User | null;
  session: Session | null;
  logout: () => void;
  hasUnsavedChanges: boolean;
  saveChanges: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Set up authentication listener and load settings
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin role when user changes
        if (session?.user) {
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    // Always load admin settings for everyone
    loadAdminSettings();

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();
      
      setIsAdmin(!!data);
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    }
  };

  // Load admin settings from Supabase
  const loadAdminSettings = async () => {
    // No longer needed since PaymentManagement handles its own settings
  };

  const saveChanges = async () => {
    try {
      // No longer need to save booking section settings here
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving admin settings:', error);
      setHasUnsavedChanges(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };


  return (
    <AdminContext.Provider value={{
      isLoggedIn: !!session,
      isAdmin,
      user,
      session,
      logout,
      hasUnsavedChanges,
      saveChanges
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};