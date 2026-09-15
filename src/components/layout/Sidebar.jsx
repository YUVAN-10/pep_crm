import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_SECTIONS } from '../../utils/constants';
import { PepLogo } from '../../assets/logo/PepLogo';
import { LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

export const Sidebar = ({
  collapsed = false,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container - 260px width */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white text-slate-900 border-r border-slate-200/80 transition-all duration-300 shadow-sm overflow-hidden select-none',
          collapsed ? 'w-20' : 'w-[260px]',
          // Mobile state
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Sticky Logo Header */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-slate-100 bg-white sticky top-0 z-10 shrink-0">
          <div className="flex items-center overflow-hidden">
            {collapsed ? (
              <PepLogo size={36} showText={false} variant="dark" />
            ) : (
              <PepLogo size={36} showText={true} variant="dark" />
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grouped Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  {section.title}
                </div>
              )}

              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.name : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all duration-200 group relative',
                        isActive
                          ? 'bg-purple-50 text-brand-primary border border-purple-200/60 shadow-2xs font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="relative flex items-center justify-center">
                          <Icon
                            className={cn(
                              'w-4 h-4 transition-transform duration-200 group-hover:scale-110',
                              isActive ? 'text-brand-primary' : 'text-slate-400 group-hover:text-slate-700'
                            )}
                          />
                        </div>

                        {!collapsed && (
                          <span className="truncate tracking-wide">{item.name}</span>
                        )}

                        {!collapsed && item.badge && (
                          <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-brand-primary">
                            {item.badge}
                          </span>
                        )}

                        {/* Active vertical left pill */}
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-brand-primary" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
          {!collapsed ? (
            <div className="flex items-center gap-3 p-2 rounded-[14px] bg-white border border-slate-200/80 mb-2 shadow-2xs">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-100"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-400 font-medium truncate">{currentUser?.role}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-2">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt="Profile"
                title={currentUser?.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-100"
              />
            </div>
          )}

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-[12px] text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors',
              collapsed && 'justify-center'
            )}
            title="Log Out"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
            {!collapsed && <span>Log Out</span>}
          </button>

          {/* Collapse Toggle (Desktop only) */}
          <div className="hidden lg:flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
