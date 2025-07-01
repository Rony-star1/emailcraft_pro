import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Login from "pages/login";
import Register from "pages/register";
import Dashboard from "pages/dashboard";
import CampaignAnalytics from "pages/campaign-analytics";
import ContactManagement from "pages/contact-management";
import CampaignBuilder from "pages/campaign-builder";
import AccountSettings from "pages/account-settings";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/campaign-analytics" element={<CampaignAnalytics />} />
        <Route path="/contact-management" element={<ContactManagement />} />
        <Route path="/campaign-builder" element={<CampaignBuilder />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;