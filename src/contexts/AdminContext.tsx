import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminContextType {
  isLoggedIn: boolean;
  showBookingSection: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  toggleBookingSection: () => void;
  hasUnsavedChanges: boolean;
  saveChanges: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showBookingSection, setShowBookingSection] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load admin settings from Supabase on component mount
  useEffect(() => {
    loadAdminSettings();
  }, []);

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

    // Load login status from localStorage (temporary session state)
    const savedLogin = localStorage.getItem('admin-logged-in');
    if (savedLogin) {
      setIsLoggedIn(JSON.parse(savedLogin));
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

  useEffect(() => {
    localStorage.setItem('admin-logged-in', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const login = (password: string): boolean => {
    if (password === 'Kpmg@138176') {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setShowBookingSection(true);
  };

  const toggleBookingSection = () => {
    setShowBookingSection(!showBookingSection);
    setHasUnsavedChanges(true);
  };

  return (
    <AdminContext.Provider value={{
      isLoggedIn,
      showBookingSection,
      login,
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