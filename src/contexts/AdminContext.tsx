import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AdminContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: User | null;
  session: Session | null;
  showBookingSection: boolean;
  logout: () => void;
  toggleBookingSection: () => void;
  hasUnsavedChanges: boolean;
  saveChanges: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showBookingSection, setShowBookingSection] = useState(true);
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

  const loadAdminSettings = async () => {
    try {
      const { data: settings } = await supabase
        .from('admin_settings')
        .select('setting_name, setting_value')
        .in('setting_name', ['show_booking_section']);

      if (settings) {
        const bookingSetting = settings.find(s => s.setting_name === 'show_booking_section');
        if (bookingSetting) {
          setShowBookingSection(bookingSetting.setting_value as boolean);
        }
      }
    } catch (error) {
      console.error('Error loading admin settings:', error);
      // Fallback to localStorage if Supabase fails
      const saved = localStorage.getItem('show-booking-section');
      if (saved) {
        setShowBookingSection(JSON.parse(saved));
      }
    }
  };

  const saveChanges = async () => {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          setting_name: 'show_booking_section',
          setting_value: showBookingSection
        }, {
          onConflict: 'setting_name'
        });

      if (error) throw error;
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving admin settings:', error);
      // Fallback to localStorage
      localStorage.setItem('show-booking-section', JSON.stringify(showBookingSection));
      setHasUnsavedChanges(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setShowBookingSection(true);
  };

  const toggleBookingSection = () => {
    setShowBookingSection(!showBookingSection);
    setHasUnsavedChanges(true);
  };

  return (
    <AdminContext.Provider value={{
      isLoggedIn: !!session,
      isAdmin,
      user,
      session,
      showBookingSection,
      logout,
      toggleBookingSection,
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