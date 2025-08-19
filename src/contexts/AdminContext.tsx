import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AdminContextType {
  isLoggedIn: boolean;
  showBookingSection: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  toggleBookingSection: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('admin-logged-in');
    return saved ? JSON.parse(saved) : false;
  });
  const [showBookingSection, setShowBookingSection] = useState(() => {
    const saved = localStorage.getItem('show-booking-section');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('admin-logged-in', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('show-booking-section', JSON.stringify(showBookingSection));
  }, [showBookingSection]);

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