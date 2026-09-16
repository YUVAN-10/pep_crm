import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// V1 Pages
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import LeadsListPage from '../pages/leads/LeadsListPage';
import LeadDetailsPage from '../pages/leads/LeadDetailsPage';
import FollowupsPage from '../pages/followups/FollowupsPage';
import ClientsListPage from '../pages/clients/ClientsListPage';
import ClientDetailsPage from '../pages/clients/ClientDetailsPage';
import ReportsAnalyticsPage from '../pages/reports/ReportsAnalyticsPage';
import SettingsPage from '../pages/settings/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Dashboard CRM V1 Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* 1. Leads */}
        <Route path="/leads" element={<LeadsListPage />} />
        <Route path="/leads/:id" element={<LeadDetailsPage />} />

        {/* 2. Follow-ups */}
        <Route path="/follow-ups" element={<FollowupsPage />} />

        {/* 3. Customers */}
        <Route path="/customers" element={<ClientsListPage />} />
        <Route path="/customers/:id" element={<ClientDetailsPage />} />
        <Route path="/clients" element={<ClientsListPage />} />
        <Route path="/clients/:id" element={<ClientDetailsPage />} />

        {/* 4. Reports */}
        <Route path="/reports" element={<ReportsAnalyticsPage />} />

        {/* 5. Settings */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
