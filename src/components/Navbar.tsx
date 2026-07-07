import React, { useState } from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import { USER_AVATAR } from '../data';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onSearchCase: (id: string) => void;
}

export default function Navbar({ currentView, onNavigate, onSearchCase }: NavbarProps) {
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearchCase(searchVal.trim());
      setSearchVal('');
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'submit-complaint', label: 'Submit Complaint' },
    { id: 'resources', label: 'Resources' },
    { id: 'contact', label: 'Contact' },
    { id: 'admin-portal', label: 'Admin Portal' },
  ];

  const notifications = [
    { id: 1, text: "Complaint CR-8829-2024 has been updated: 'Investigation Underway'", time: "2 hours ago", unread: true },
    { id: 2, text: "Annual Civic Infrastructure Report 2026 published", time: "1 day ago", unread: false },
    { id: 3, text: "Welcome to the new CivicPortal system!", time: "3 days ago", unread: false }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="flex items-center justify-between px-6 md:px-10 h-20 w-full max-w-7xl mx-auto">
        {/* Left: Brand Logo & Links */}
        <div className="flex items-center gap-8 lg:gap-12">
          <span 
            onClick={() => onNavigate('dashboard')}
            className="font-sans text-2xl font-bold text-[#00346f] cursor-pointer active:scale-95 transition-transform"
          >
            CivicPortal
          </span>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => {
              const isActive = currentView === item.id || 
                (item.id === 'submit-complaint' && currentView.startsWith('submit-complaint')) ||
                (item.id === 'dashboard' && currentView === 'tracking');
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`font-sans text-base transition-all duration-200 pb-1 cursor-pointer hover:text-[#00346f] ${
                    isActive
                      ? 'text-[#00346f] font-bold border-b-2 border-[#00346f]'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Search, Notifications, Avatar */}
        <div className="flex items-center gap-4">
          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 focus-within:border-[#00346f] transition-colors">
            <Search className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={
                currentView === 'resources' 
                  ? "Search resources..." 
                  : currentView === 'tracking'
                  ? "Search cases..."
                  : "Track a complaint..."
              }
              className="bg-transparent border-none focus:outline-none text-sm w-48 font-medium text-gray-700"
            />
          </form>

          {/* Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-500 hover:text-[#00346f] hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full animate-pulse"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                  <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-[#00346f] hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0 cursor-pointer">
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-xs ${n.unread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                          {n.text}
                        </p>
                        {n.unread && <span className="w-1.5 h-1.5 bg-[#00346f] rounded-full shrink-0 mt-1"></span>}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors">
            <img 
              className="w-full h-full object-cover" 
              src={USER_AVATAR} 
              alt="User headshot"
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 shadow-lg">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
            <Search className="text-gray-400 w-5 h-5 mr-2" />
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Track a complaint..."
              className="bg-transparent border-none focus:outline-none text-sm w-full font-medium"
            />
          </form>
          
          <div className="flex flex-col gap-2 pt-2">
            {navItems.map((item) => {
              const isActive = currentView === item.id || 
                (item.id === 'submit-complaint' && currentView.startsWith('submit-complaint'));
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left font-sans py-2 text-base rounded-md transition-colors ${
                    isActive
                      ? 'text-[#00346f] font-bold bg-[#f1f3ff] px-3'
                      : 'text-gray-600 hover:text-gray-900 px-3'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
