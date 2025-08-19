import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isLoggedIn: boolean;
  showBookingSection: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  toggleBookingSection: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showBookingSection, setShowBookingSection] = useState(true);

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
  };

  return (
    <AdminContext.Provider value={{
      isLoggedIn,
      showBookingSection,
      login,
      logout,
      toggleBookingSection
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