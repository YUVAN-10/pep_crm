import React, { useState } from 'react';
import {
  Bell,
  MessageSquare,
  Moon,
  Menu,
  ChevronDown,
  Building,
  User,
  HelpCircle,
  LogOut,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import SearchBar from '../forms/SearchBar';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onMobileMenuToggle }) => {
  const { currentUser, logout } = useAuth();
  const { notifications, markAllAsRead, showInfo } = useNotifications();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'orange':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'amber':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'green':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'red':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-2xs">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="p-2 text-slate-600 hover:text-brand-primary rounded-[12px] hover:bg-purple-50 lg:hidden"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search clients, leads, tasks (⌘K)..."
          size="md"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Company Pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
          <Building className="w-3.5 h-3.5 text-brand-primary" />
          <span>Pep Software Pvt Ltd</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-purple-100 text-brand-primary font-bold">
            PRO
          </span>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotificationsMenu(!showNotificationsMenu);
              setShowProfileMenu(false);
            }}
            className="relative p-2 text-slate-600 hover:text-brand-primary rounded-[12px] hover:bg-purple-50 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-amber-500 rounded-full ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showNotificationsMenu && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-[22px] shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-sm text-slate-900">Notification Center</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-brand-primary">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-xs text-brand-primary font-semibold hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto my-2 space-y-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl transition-all ${
                      n.unread ? 'bg-purple-50/40 border border-purple-100' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryBadgeClass(n.category)}`}>
                        {n.categoryLabel}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 mt-1.5">{n.title}</h5>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.description}</p>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500">{n.relatedRecord}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNotificationsMenu(false);
                          navigate(n.relatedPath);
                        }}
                        className="px-2 py-1 rounded bg-brand-primary text-white text-[10px] font-bold flex items-center gap-1 hover:bg-brand-deep"
                      >
                        View Record <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotificationsMenu(false);
            }}
            className="flex items-center gap-3 p-1.5 rounded-[16px] hover:bg-purple-50 border border-transparent hover:border-purple-200 transition-all"
          >
            <Avatar src={currentUser?.avatar} name={currentUser?.name} size="md" status="online" />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser?.name || 'Sanjay Verma'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {currentUser?.role || 'Managing Director'}
              </span>
            </div>
            <ChevronDown className="hidden md:block w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-[20px] shadow-2xl border border-slate-100 p-2 z-50">
              <div className="px-3 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
              </div>
              <div className="py-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
