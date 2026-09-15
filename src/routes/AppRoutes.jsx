import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ClientsListPage from '../pages/clients/ClientsListPage';
import ClientDetailsPage from '../pages/clients/ClientDetailsPage';
import LeadsListPage from '../pages/leads/LeadsListPage';
import LeadDetailsPage from '../pages/leads/LeadDetailsPage';
import OpportunitiesPage from '../pages/opportunities/OpportunitiesPage';
import RequirementsPage from '../pages/requirements/RequirementsPage';
import QuotationsPage from '../pages/quotations/QuotationsPage';
import ProjectsListPage from '../pages/projects/ProjectsListPage';
import ProjectDetailsPage from '../pages/projects/ProjectDetailsPage';
import TasksKanbanPage from '../pages/tasks/TasksKanbanPage';
import EmployeesListPage from '../pages/employees/EmployeesListPage';
import EmployeeDetailsPage from '../pages/employees/EmployeeDetailsPage';
import FinanceOverviewPage from '../pages/finance/FinanceOverviewPage';
import MeetingsCalendarPage from '../pages/meetings/MeetingsCalendarPage';
import FollowupsPage from '../pages/followups/FollowupsPage';
import ReportsAnalyticsPage from '../pages/reports/ReportsAnalyticsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected Dashboard CRM Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Leads & Pipeline */}
        <Route path="/leads" element={<LeadsListPage />} />
        <Route path="/leads/:id" element={<LeadDetailsPage />} />
        <Route path="/opportunities" element={<OpportunitiesPage />} />
        <Route path="/follow-ups" element={<FollowupsPage />} />

        {/* Customers & Specs */}
        <Route path="/customers" element={<ClientsListPage />} />
        <Route path="/customers/:id" element={<ClientDetailsPage />} />
        <Route path="/clients" element={<ClientsListPage />} />
        <Route path="/clients/:id" element={<ClientDetailsPage />} />
        <Route path="/requirements" element={<RequirementsPage />} />
        <Route path="/quotations" element={<QuotationsPage />} />

        {/* Projects & Execution */}
        <Route path="/projects" element={<ProjectsListPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/tasks" element={<TasksKanbanPage />} />

        {/* Finance & Team */}
        <Route path="/payments" element={<FinanceOverviewPage />} />
        <Route path="/finance" element={<FinanceOverviewPage />} />
        <Route path="/employees" element={<EmployeesListPage />} />
        <Route path="/employees/:id" element={<EmployeeDetailsPage />} />
        <Route path="/meetings" element={<MeetingsCalendarPage />} />

        {/* Analytics */}
        <Route path="/reports" element={<ReportsAnalyticsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
