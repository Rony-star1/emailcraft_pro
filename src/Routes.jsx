import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
// Add your imports here
import Login from "pages/login";
import Register from "pages/register";
import Dashboard from "pages/dashboard";
import CampaignAnalytics from "pages/campaign-analytics";
import ContactManagement from "pages/contact-management";
import CampaignBuilder from "pages/campaign-builder";
import AccountSettings from "pages/account-settings";
import BillingPage from "pages/billing";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/campaign-analytics" element={
          <ProtectedRoute>
            <CampaignAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/contact-management" element={
          <ProtectedRoute>
            <ContactManagement />
          </ProtectedRoute>
        } />
        <Route path="/campaign-builder" element={
          <ProtectedRoute>
            <CampaignBuilder />
          </ProtectedRoute>
        } />
        <Route path="/account-settings" element={
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        } />
        <Route path="/billing" element={
          <ProtectedRoute>
            <BillingPage />
          </ProtectedRoute>
        } />
        
        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;