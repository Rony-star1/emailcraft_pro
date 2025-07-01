import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const BreadcrumbTrail = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/campaign-builder': { label: 'Campaign Builder', icon: 'Mail' },
    '/contact-management': { label: 'Contact Management', icon: 'Users' },
    '/campaign-analytics': { label: 'Analytics', icon: 'BarChart3' },
    '/account-settings': { label: 'Account Settings', icon: 'Settings' },
    '/register': { label: 'Register', icon: 'UserPlus' },
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];

    // Always start with Dashboard for authenticated routes
    if (location.pathname !== '/register' && location.pathname !== '/') {
      breadcrumbs.push({
        label: 'Dashboard',
        path: '/dashboard',
        icon: 'LayoutDashboard'
      });
    }

    // Add current page if it's not dashboard
    if (location.pathname !== '/dashboard' && location.pathname !== '/') {
      const currentRoute = routeMap[location.pathname];
      if (currentRoute) {
        breadcrumbs.push({
          label: currentRoute.label,
          path: location.pathname,
          icon: currentRoute.icon,
          current: true
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on register page or if only one item
  if (location.pathname === '/register' || breadcrumbs.length <= 1) {
    return null;
  }

  const handleBreadcrumbClick = (path, isCurrent) => {
    if (!isCurrent) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-text-muted mx-2" 
                aria-hidden="true"
              />
            )}
            
            {breadcrumb.current ? (
              <span 
                className="flex items-center space-x-1.5 text-text-primary font-medium"
                aria-current="page"
              >
                <Icon name={breadcrumb.icon} size={14} />
                <span>{breadcrumb.label}</span>
              </span>
            ) : (
              <Button
                variant="ghost"
                onClick={() => handleBreadcrumbClick(breadcrumb.path, breadcrumb.current)}
                className="flex items-center space-x-1.5 text-text-secondary hover:text-text-primary p-1 h-auto font-normal"
              >
                <Icon name={breadcrumb.icon} size={14} />
                <span>{breadcrumb.label}</span>
              </Button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbTrail;