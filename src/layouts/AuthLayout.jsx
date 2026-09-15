import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
