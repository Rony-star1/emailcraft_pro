import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import UserProfileDropdown from './UserProfileDropdown';
import MobileMenu from './MobileMenu';

const NavigationBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: 'LayoutDashboard', 
      tooltip: 'Campaign overview and quick actions' 
    },
    { 
      label: 'Campaigns', 
      path: '/campaign-builder', 
      icon: 'Mail', 
      tooltip: 'Create and manage email campaigns' 
    },
    { 
      label: 'Contacts', 
      path: '/contact-management', 
      icon: 'Users', 
      tooltip: 'Manage your contact lists and segments' 
    },
    { 
      label: 'Analytics', 
      path: '/campaign-analytics', 
      icon: 'BarChart3', 
      tooltip: 'View campaign performance and insights' 
    },
  ];

  // Use authenticated user data or fallback
  const currentUser = user ? {
    name: user.businessName || user.email,
    email: user.email,
    avatar: '/assets/images/avatar-placeholder.png'
  } : {
    name: 'User',
    email: '',
    avatar: '/assets/images/avatar-placeholder.png'
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to login
      navigate('/login');
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-1000 bg-surface border-b border-border shadow-elevation-1">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-3 hover:opacity-80 transition-micro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1"
                aria-label="EmailCraft Pro - Go to Dashboard"
              >
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <Icon name="Mail" size={20} color="white" />
                </div>
                <span className="text-xl font-semibold text-text-primary font-heading">
                  EmailCraft Pro
                </span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                {navigationItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-micro flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      isActiveRoute(item.path)
                        ? 'bg-primary-50 text-primary border border-primary-100' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                    }`}
                    title={item.tooltip}
                    aria-current={isActiveRoute(item.path) ? 'page' : undefined}
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - User Profile & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* User Profile Dropdown */}
              <UserProfileDropdown
                user={currentUser}
                isOpen={userDropdownOpen}
                onToggle={toggleUserDropdown}
                onLogout={handleLogout}
              />

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  onClick={toggleMobileMenu}
                  className="p-2"
                  aria-label="Open navigation menu"
                  aria-expanded={mobileMenuOpen}
                >
                  <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigationItems={navigationItems}
        currentPath={location.pathname}
      />
    </>
  );
};

export default NavigationBar;
