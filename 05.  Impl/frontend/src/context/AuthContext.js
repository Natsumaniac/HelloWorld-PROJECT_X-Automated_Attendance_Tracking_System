import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const loginAdmin = () => {
    setIsAdminLoggedIn(true);
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isAdminLoggedIn, loginAdmin, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 