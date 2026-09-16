import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    id: 'usr-1',
    name: 'Sanjay Verma',
    email: 'admin@pepsoftwares.com',
    role: 'Managing Director',
    avatar: null,
    company: 'PEP Software Enterprise',
  });

  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCurrentUser({
      id: 'usr-1',
      name: 'Sanjay Verma',
      email: email || 'admin@pepsoftwares.com',
      role: 'Managing Director',
      avatar: null,
      company: 'PEP Software Enterprise',
    });
    setIsAuthenticated(true);
    setLoading(false);
    return true;
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsAuthenticated(true);
    setLoading(false);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        login,
        loginWithGoogle,
        logout,
      }}
    >
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

export default AuthContext;
