import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import UserProfileDropdown from './UserProfileDropdown';

const NavigationBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Campaigns', path: '/campaign-builder', icon: 'Mail' },
    { label: 'Contacts', path: '/contact-management', icon: 'Users' },
    { label: 'Analytics', path: '/campaign-analytics', icon: 'BarChart3' },
    { label: 'Billing', path: '/billing', icon: 'CreditCard' },
  ];

  const currentUser = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/assets/images/avatar-placeholder.png'
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    navigate('/register');
  };

  const isActiveRoute = (path) => location.pathname.startsWith(path);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-1000 bg-surface border-b border-border shadow-elevation-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md p-1">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <Icon name="Mail" size={20} color="white" />
                </div>
                <span className="text-xl font-semibold text-text-primary font-heading">
                  EmailCraft Pro
                </span>
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-micro flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      isActiveRoute(item.path)
                        ? 'bg-primary-50 text-primary'
                        : 'text-text-secondary hover:bg-secondary-50 hover:text-text-primary'
                    }`}
                    aria-current={isActiveRoute(item.path) ? 'page' : undefined}
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <div className="hidden md:block">
                <UserProfileDropdown
                  user={currentUser}
                  isOpen={userDropdownOpen}
                  onToggle={() => setUserDropdownOpen(!userDropdownOpen)}
                  onLogout={handleLogout}
                />
              </div>
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2"
                  aria-label="Open navigation menu"
                >
                  <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-16 left-0 right-0 bg-surface border-t border-border shadow-lg transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-3 ${
                  isActiveRoute(item.path)
                    ? 'bg-primary-50 text-primary'
                    : 'text-text-secondary hover:bg-secondary-50 hover:text-text-primary'
                }`}
                aria-current={isActiveRoute(item.path) ? 'page' : undefined}
              >
                <Icon name={item.icon} size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <img className="h-10 w-10 rounded-full" src={currentUser.avatar} alt="" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-text-primary">{currentUser.name}</div>
                <div className="text-sm font-medium text-text-secondary">{currentUser.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                to="/account-settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-secondary-50 hover:text-text-primary"
              >
                Account Settings
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-text-secondary hover:bg-secondary-50 hover:text-text-primary"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavigationBar;