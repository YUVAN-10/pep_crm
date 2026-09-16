import React, { useState } from 'react';
import {
  Menu,
  ChevronDown,
  Building,
  LogOut,
  Settings,
  Search,
  Bell,
} from 'lucide-react';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar = ({ onMobileMenuToggle }) => {
  const { currentUser, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/leads?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-[#F0F4F8] border-b border-slate-200/40">
      {/* Left: Mobile Toggle & Center Pill Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-md">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="p-2 text-slate-600 hover:text-[#1677FF] rounded-xl hover:bg-slate-200/50 lg:hidden"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-full" onKeyDown={handleSearchSubmit}>
          <div className="relative flex items-center w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full bg-white border border-slate-200/80 focus:border-[#1677FF] rounded-full text-xs text-slate-800 placeholder:text-slate-400 pl-9 pr-10 py-1.5 shadow-2xs transition-all outline-none"
            />
            <div className="absolute left-3 text-slate-400 pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </div>
            <div className="absolute right-3 flex items-center">
              <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 text-[10px] font-bold flex items-center justify-center">
                /
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Actions: Notification Bell + Avatar */}
      <div className="flex items-center gap-3">
        {/* Notification Bell Circle */}
        <button
          type="button"
          className="w-8 h-8 rounded-full bg-white border border-slate-200/80 text-slate-500 hover:text-[#1677FF] hover:bg-blue-50 flex items-center justify-center shadow-2xs transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#1677FF]/30 transition-all"
          >
            <Avatar src={currentUser?.avatar} name={currentUser?.name} size="sm" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-[20px] shadow-2xl border border-slate-100 p-2 z-50">
              <div className="px-3 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{currentUser?.name || 'Sanjay Verma'}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser?.email || 'sanjay@pepsoftware.com'}</p>
              </div>
              <div className="py-1.5 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Settings
                </button>
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
