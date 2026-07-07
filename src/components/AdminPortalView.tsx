import React, { useState } from 'react';
import { 
  ShieldAlert, Lock, User, CheckCircle2, AlertTriangle, Clock, 
  Search, Filter, ChevronRight, Eye, RefreshCw, LogOut, LayoutDashboard,
  BarChart2, FileText, Check, Settings, ShieldCheck, Mail, ArrowRight, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DEPARTMENTS } from '../data';
import { Complaint } from '../types';

interface AdminPortalViewProps {
  complaints: Complaint[];
  onUpdateComplaint: (updated: Complaint) => void;
  onNavigate: (view: string) => void;
  triggerToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function AdminPortalView({ 
  complaints, 
  onUpdateComplaint, 
  onNavigate,
  triggerToast 
}: AdminPortalViewProps) {
  // Session states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'cases' | 'analytics' | 'security'>('cases');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Case details panel states
  const [selectedCase, setSelectedCase] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<'Pending' | 'In Progress' | 'Resolved'>('Pending');
  const [customLogTitle, setCustomLogTitle] = useState('');
  const [customLogDesc, setCustomLogDesc] = useState('');

  // Mock Admin Officer Info
  const adminOfficer = {
    name: "Officer Raymond Holt",
    title: "Senior Intake Manager",
    badge: "SH-99-B9",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCojxRm8jFKWHIyePaX6Yj6UOdNzKUTiFcRNGhkFkMDn8YrAT3ojHYBJrtO_26FRV-H8CWMwE1twsFSDIFsq3nFi9329TkFwuqv4U5nB2nSZhLbPKUqXzsporjX15sX8AgRw0zta9IB1rBuGP_kKewP5Wptq1qyaHWgO8mNwL4F3p62jPHu_yRXTvLs6sVWnpWDEeVn3PQbRY9YMgSvcUks5ONlIHL-v1dkQ5Qqh05r1RR60-L_nJovh8AjuG3adAJuu4YlJYoYdwRe"
  };

  // Static Security log state
  const [securityLogs, setSecurityLogs] = useState<Array<{ timestamp: string; action: string; type: 'info' | 'warn' | 'success' }>>([
    { timestamp: "05:22:15 AM", action: "Intake Portal online sync established", type: "success" },
    { timestamp: "05:15:30 AM", action: "User database background backup completed", type: "info" },
    { timestamp: "04:30:10 AM", action: "Automated report dispatcher scheduled run", type: "info" }
  ]);

  const addSecurityLog = (action: string, type: 'info' | 'warn' | 'success') => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSecurityLogs(prev => [{ timestamp: timeStr, action, type }, ...prev]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@civicportal.gov' && password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError('');
      triggerToast("Case Officer successfully authenticated", "success");
      addSecurityLog(`Officer Raymond Holt (Badge ${adminOfficer.badge}) logged in`, 'success');
    } else {
      setLoginError("Invalid municipal credentials. Please check your passcode.");
      triggerToast("Authentication failed", "error");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    setSelectedCase(null);
    triggerToast("Case Officer logged out", "info");
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (c.fullName && c.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesDept = deptFilter === 'All' || c.department === deptFilter;
    const matchesPriority = priorityFilter === 'All' || c.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesDept && matchesPriority;
  });

  // Analytics calculator
  const totalCases = complaints.length;
  const pendingCases = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCases = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCases = complaints.filter(c => c.status === 'Resolved').length;
  const highPriorityCases = complaints.filter(c => c.priority === 'High').length;

  const handleUpdateStatusAndHistory = () => {
    if (!selectedCase) return;

    // Create copy of the complaint
    const updatedCase: Complaint = { ...selectedCase };
    const oldStatus = updatedCase.status;
    updatedCase.status = newStatus;

    // Log the changes inside the history list
    const timestampStr = `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    const newHistoryEntry = {
      title: customLogTitle.trim() || `Status updated to ${newStatus}`,
      timestamp: timestampStr,
      status: newStatus,
      completed: true,
      description: customLogDesc.trim() || `Officer Holt modified case status from '${oldStatus}' to '${newStatus}'.`
    };

    // Push new entry to history and keep other entries
    updatedCase.history = [newHistoryEntry, ...updatedCase.history.map(h => ({ ...h, completed: true }))];
    
    // Also update metrics if matching
    updatedCase.metrics = updatedCase.metrics.map(m => ({
      ...m,
      priority: updatedCase.priority
    }));

    onUpdateComplaint(updatedCase);
    setSelectedCase(updatedCase);
    setCustomLogTitle('');
    setCustomLogDesc('');
    
    triggerToast(`Case ${updatedCase.id} successfully updated`, "success");
    addSecurityLog(`Case ${updatedCase.id} status modified to ${newStatus}`, 'info');
  };

  const selectQuickNoteTemplate = (title: string, desc: string) => {
    setCustomLogTitle(title);
    setCustomLogDesc(desc);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 font-sans min-h-screen">
      
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          /* LOGIN SCREEN VIEW */
          <motion.div 
            key="login"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-md mx-auto my-12"
          >
            {/* Header Lock Logo */}
            <div className="text-center mb-8 space-y-2">
              <div className="w-14 h-14 bg-[#00346f]/10 text-[#00346f] rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 font-display">
                Official Admin Portal
              </h1>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                Government Identity Verification
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-6">
              
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-2.5 text-xs text-amber-800 leading-relaxed font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-bold">Authorized Access Only</p>
                  <p className="mt-0.5">This terminal serves authorized Case Officers. Session activity, audit trail logs, and IP locations are mapped and logged under city charter rules.</p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> Intake Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@civicportal.gov"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/10 focus:border-[#00346f] focus:outline-none transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-gray-400" /> Passcode
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/10 focus:border-[#00346f] focus:outline-none transition-all font-medium"
                  />
                </div>

                {loginError && (
                  <p className="text-red-600 text-xs font-bold flex items-center gap-1 bg-red-50 p-2.5 rounded border border-red-200">
                    <AlertTriangle className="w-3.5 h-3.5" /> {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#00346f] hover:bg-[#004a99] text-white font-bold text-sm rounded-lg shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Verify Identity <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Demo Account Credentials helper */}
              <div className="border-t border-gray-100 pt-5 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Officer Demo Credentials
                </span>
                <div className="bg-[#f9f9ff] border border-gray-150 p-3 rounded-lg text-xs space-y-1.5 font-semibold text-gray-600 select-all">
                  <p>Email: <span className="text-[#00346f] font-bold">admin@civicportal.gov</span></p>
                  <p>Passcode: <span className="text-[#00346f] font-bold">admin123</span></p>
                </div>
              </div>
            </div>

            {/* Quick Go Back Button */}
            <div className="text-center mt-6">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="text-gray-500 hover:text-[#00346f] text-xs font-bold hover:underline transition-colors"
              >
                Return to Citizen Portal
              </button>
            </div>
          </motion.div>
        ) : (
          /* ADMIN PORTAL PANEL - LOGGED IN */
          <motion.div 
            key="admin-dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8 animate-fade-in"
          >
            {/* Admin Header with Officer Profile Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#00346f]/20 shadow-sm">
                  <img className="w-full h-full object-cover" src={adminOfficer.avatar} alt="Admin Avatar" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900 font-display">{adminOfficer.name}</h1>
                    <span className="bg-blue-50 text-[#00346f] border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Senior Officer
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs font-semibold mt-0.5">
                    Badge ID: <span className="font-mono text-[#00346f]">{adminOfficer.badge}</span> • Municipal Intake Service
                  </p>
                </div>
              </div>

              {/* Header Right Log-Out Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="px-4 py-2.5 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold text-xs rounded-lg shadow-sm transition-all duration-200 active:scale-95 cursor-pointer"
                >
                  Citizen View
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-lg shadow-sm border border-red-200 transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> End Session
                </button>
              </div>
            </div>

            {/* Officer Metrics Ribbon Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider block">Database Intake</span>
                <span className="text-2xl font-extrabold text-[#00346f] mt-1 block">{totalCases}</span>
                <span className="text-gray-400 text-[10px] font-semibold mt-1 block">Total Cases Lodged</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <span className="text-amber-500 font-bold text-[10px] uppercase tracking-wider block">Intake Queue</span>
                <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{pendingCases}</span>
                <span className="text-gray-400 text-[10px] font-semibold mt-1 block">Unassigned Pending Review</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <span className="text-blue-500 font-bold text-[10px] uppercase tracking-wider block">Field Dispatches</span>
                <span className="text-2xl font-extrabold text-blue-600 mt-1 block">{inProgressCases}</span>
                <span className="text-gray-400 text-[10px] font-semibold mt-1 block">Active Maintenance</span>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <span className="text-green-500 font-bold text-[10px] uppercase tracking-wider block">Resolved Cases</span>
                <span className="text-2xl font-extrabold text-green-600 mt-1 block">{resolvedCases}</span>
                <span className="text-gray-400 text-[10px] font-semibold mt-1 block">Completed & Closed</span>
              </div>

              <div className="bg-[#ba1a1a]/5 border border-[#ba1a1a]/15 rounded-xl p-5 shadow-sm">
                <span className="text-[#ba1a1a] font-bold text-[10px] uppercase tracking-wider block">High Priority</span>
                <span className="text-2xl font-extrabold text-[#ba1a1a] mt-1 block">{highPriorityCases}</span>
                <span className="text-gray-400 text-[10px] font-semibold mt-1 block">Emergency Response Tier</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 flex items-center gap-1">
              <button 
                onClick={() => { setActiveTab('cases'); setSelectedCase(null); }}
                className={`px-5 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'cases' 
                    ? 'border-[#00346f] text-[#00346f]' 
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Case Dispatch
              </button>
              <button 
                onClick={() => { setActiveTab('analytics'); setSelectedCase(null); }}
                className={`px-5 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'analytics' 
                    ? 'border-[#00346f] text-[#00346f]' 
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <BarChart2 className="w-4 h-4" /> Service Metrics
              </button>
              <button 
                onClick={() => { setActiveTab('security'); setSelectedCase(null); }}
                className={`px-5 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'security' 
                    ? 'border-[#00346f] text-[#00346f]' 
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Activity className="w-4 h-4" /> System Audit Logs
              </button>
            </div>

            {/* TAB CONTENT: CASES */}
            {activeTab === 'cases' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Search & Table List of Cases */}
                <div className={`${selectedCase ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all`}>
                  
                  {/* Table Controls (Search & Filters) */}
                  <div className="p-5 bg-gray-50/50 border-b border-gray-200 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Search */}
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search cases by ID, reporter, or category..."
                          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#00346f] font-medium"
                        />
                      </div>
                      
                      {/* Reset Button */}
                      {(statusFilter !== 'All' || deptFilter !== 'All' || priorityFilter !== 'All' || searchQuery !== '') && (
                        <button 
                          onClick={() => {
                            setStatusFilter('All');
                            setDeptFilter('All');
                            setPriorityFilter('All');
                            setSearchQuery('');
                          }}
                          className="px-3.5 py-2 text-xs font-bold text-[#00346f] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>

                    {/* Filter Ribbons */}
                    <div className="grid grid-cols-3 gap-3">
                      {/* Status Filter */}
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Status</label>
                        <select 
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full p-2 border border-gray-250 bg-white text-xs rounded-lg focus:outline-none"
                        >
                          <option value="All">All Statuses</option>
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>

                      {/* Department Filter */}
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Department</label>
                        <select 
                          value={deptFilter}
                          onChange={(e) => setDeptFilter(e.target.value)}
                          className="w-full p-2 border border-gray-250 bg-white text-xs rounded-lg focus:outline-none"
                        >
                          <option value="All">All Departments</option>
                          {DEPARTMENTS.map(d => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Priority Filter */}
                      <div>
                        <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Priority</label>
                        <select 
                          value={priorityFilter}
                          onChange={(e) => setPriorityFilter(e.target.value)}
                          className="w-full p-2 border border-gray-250 bg-white text-xs rounded-lg focus:outline-none"
                        >
                          <option value="All">All Priorities</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Table of Complaints */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-gray-50 border-b border-gray-150 text-gray-400 font-bold uppercase tracking-wider">
                        <tr>
                          <th className="px-5 py-3.5">ID</th>
                          <th className="px-5 py-3.5">Reporter</th>
                          <th className="px-5 py-3.5">Category / Dept</th>
                          <th className="px-5 py-3.5">Priority</th>
                          <th className="px-5 py-3.5">Status</th>
                          <th className="px-5 py-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                        {filteredComplaints.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                              No cases located matching query filter parameters.
                            </td>
                          </tr>
                        ) : (
                          filteredComplaints.map((c) => (
                            <tr 
                              key={c.id} 
                              onClick={() => {
                                setSelectedCase(c);
                                setNewStatus(c.status);
                              }}
                              className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                                selectedCase?.id === c.id ? 'bg-[#f0f4ff] border-l-4 border-l-[#00346f]' : ''
                              }`}
                            >
                              <td className="px-5 py-4 font-bold text-[#00346f]">{c.id}</td>
                              <td className="px-5 py-4">
                                <span className="block font-bold text-gray-800">{c.fullName || 'Anonymous'}</span>
                                <span className="block text-[10px] text-gray-400 font-semibold">{c.createdAt}</span>
                              </td>
                              <td className="px-5 py-4 max-w-xs">
                                <span className="block font-semibold text-gray-800">{c.category}</span>
                                <span className="block text-[10px] text-gray-400 truncate">{c.department}</span>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  c.priority === 'High' 
                                    ? 'bg-[#ba1a1a]/10 text-[#ba1a1a]' 
                                    : c.priority === 'Medium' 
                                    ? 'bg-amber-100 text-amber-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {c.priority}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  c.status === 'Resolved' 
                                    ? 'bg-green-50 text-green-700 border border-green-100' 
                                    : c.status === 'In Progress' 
                                    ? 'bg-yellow-50 text-yellow-800 border border-yellow-100' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {c.status}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-right">
                                <button className="p-1.5 hover:bg-gray-100 rounded-md text-[#00346f]">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Side: Case Action Drawer Panel */}
                {selectedCase && (
                  <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl p-6 shadow-md space-y-6 animate-fade-in relative">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Currently Inspecting</span>
                        <h3 className="font-extrabold text-xl text-[#00346f] font-display mt-0.5">
                          {selectedCase.id}
                        </h3>
                      </div>
                      <button 
                        onClick={() => setSelectedCase(null)}
                        className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Complaint Overview Snippet */}
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-150 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="block text-gray-400 font-semibold text-[10px] uppercase">Reporter</span>
                          <span className="font-bold text-gray-800">{selectedCase.fullName}</span>
                        </div>
                        <div>
                          <span className="block text-gray-400 font-semibold text-[10px] uppercase">Phone</span>
                          <span className="font-medium text-gray-600">{selectedCase.phone}</span>
                        </div>
                        <div>
                          <span className="block text-gray-400 font-semibold text-[10px] uppercase">Department</span>
                          <span className="font-semibold text-[#00346f]">{selectedCase.department}</span>
                        </div>
                        <div>
                          <span className="block text-gray-400 font-semibold text-[10px] uppercase">Priority</span>
                          <span className="font-bold text-gray-700">{selectedCase.priority}</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3">
                        <span className="block text-gray-400 font-semibold text-[10px] uppercase mb-1">Location details</span>
                        <p className="font-semibold text-gray-800 leading-relaxed">{selectedCase.locationDetails || selectedCase.address}</p>
                      </div>

                      <div className="border-t border-gray-200 pt-3">
                        <span className="block text-gray-400 font-semibold text-[10px] uppercase mb-1">Issue Description</span>
                        <p className="font-medium text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedCase.description}</p>
                      </div>
                    </div>

                    {/* Officer Status Management Fields */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm text-gray-800 font-display">Log Official Dispatch Action</h4>
                      
                      {/* Radio State selectors */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Select Dispatch Status</span>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Pending', 'In Progress', 'Resolved'] as const).map(status => (
                            <button
                              key={status}
                              onClick={() => setNewStatus(status)}
                              className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                                newStatus === status
                                  ? 'bg-blue-50 text-[#00346f] border-[#00346f] ring-2 ring-[#00346f]/5'
                                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Soft Note Helpers templates */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Intake Templates Quick-fill</span>
                        <div className="flex flex-wrap gap-2">
                          <button 
                            onClick={() => selectQuickNoteTemplate("Crew Dispatched", "Civil Engineering crew has been assigned work order and dispatched to the location.")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] px-2 py-1 rounded font-semibold transition-all"
                          >
                            + Crew Dispatched
                          </button>
                          <button 
                            onClick={() => selectQuickNoteTemplate("Investigation Complete", "Officer inspector verified conditions and cleared budgetary specifications for execution.")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] px-2 py-1 rounded font-semibold transition-all"
                          >
                            + Inspector Verify
                          </button>
                          <button 
                            onClick={() => selectQuickNoteTemplate("Repairs Completed", "Municipal team finished structural concrete restorations. Road surface cleared and test validated.")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] px-2 py-1 rounded font-semibold transition-all"
                          >
                            + Repairs Done
                          </button>
                        </div>
                      </div>

                      {/* Custom note inputs */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Timeline Title</span>
                          <input 
                            type="text"
                            placeholder="e.g. Inspector review complete"
                            value={customLogTitle}
                            onChange={(e) => setCustomLogTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#00346f] focus:outline-none font-semibold text-gray-800"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Action Logs Description</span>
                          <textarea 
                            rows={3}
                            placeholder="Describe details of the action taken. This will immediately show up on the citizen's live tracking timeline..."
                            value={customLogDesc}
                            onChange={(e) => setCustomLogDesc(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#00346f] focus:outline-none font-medium text-gray-700 resize-none"
                          />
                        </div>
                      </div>

                      {/* Log Action Button */}
                      <button
                        onClick={handleUpdateStatusAndHistory}
                        className="w-full py-3 bg-[#00346f] hover:bg-[#004a99] text-white font-bold text-xs rounded-lg shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Post Action Log &amp; Update
                      </button>

                    </div>

                  </div>
                )}

              </div>
            )}

            {/* TAB CONTENT: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Intro */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-2">
                  <h3 className="font-bold text-lg text-gray-900 font-display">Service Level Agreement (SLA) &amp; Department Performance</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-3xl">
                    Municipal performance data maps operational resolution speeds against the 10-day municipal dispatch charter. High priority dispatches require inspection within 48 hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Department Case Distributions */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
                    <h4 className="font-bold text-sm text-gray-800 font-display border-b border-gray-50 pb-3 flex items-center justify-between">
                      <span>Cases by Department</span>
                      <span className="text-[10px] text-gray-400 font-semibold font-mono">LIVE MATRIX</span>
                    </h4>
                    
                    <div className="space-y-4">
                      {DEPARTMENTS.map(dept => {
                        const count = complaints.filter(c => c.department === dept.name).length;
                        const percentage = totalCases > 0 ? Math.round((count / totalCases) * 100) : 0;
                        return (
                          <div key={dept.id} className="space-y-1 text-xs">
                            <div className="flex justify-between font-semibold text-gray-700">
                              <span>{dept.name}</span>
                              <span>{count} cases ({percentage}%)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${percentage}%` }}
                                className="h-full bg-[#00346f] rounded-full transition-all duration-500"
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Priority Resolution Ratios */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
                    <h4 className="font-bold text-sm text-gray-800 font-display border-b border-gray-50 pb-3 flex items-center justify-between">
                      <span>Priority Demands Matrix</span>
                      <span className="text-[10px] text-gray-400 font-semibold font-mono">LIVE LOAD</span>
                    </h4>
                    
                    <div className="space-y-4">
                      {['High', 'Medium', 'Low'].map(p => {
                        const count = complaints.filter(c => c.priority === p).length;
                        const resolvedCount = complaints.filter(c => c.priority === p && c.status === 'Resolved').length;
                        const ratio = count > 0 ? Math.round((resolvedCount / count) * 100) : 0;
                        return (
                          <div key={p} className="space-y-1.5 text-xs">
                            <div className="flex justify-between font-bold text-gray-700">
                              <span className="flex items-center gap-1.5">
                                <span className={`w-2.5 h-2.5 rounded-full ${p === 'High' ? 'bg-red-500' : p === 'Medium' ? 'bg-amber-400' : 'bg-green-400'}`}></span>
                                {p} Priority
                              </span>
                              <span>{resolvedCount} of {count} Resolved ({ratio}%)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${ratio}%` }}
                                className={`h-full rounded-full transition-all duration-500 ${
                                  p === 'High' ? 'bg-[#ba1a1a]' : p === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
                                }`}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-blue-50 border border-blue-150 p-4 rounded-xl text-[11px] text-gray-500 leading-relaxed font-semibold">
                      Note: Resolution ratio tracks the proportion of complaints fully resolved per priority bracket. High-priority cases carry strict civil liabilities and trigger notifications to executive department heads automatically.
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: SECURITY LOGS */}
            {activeTab === 'security' && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 font-display">Session Audit Log Trail</h3>
                    <p className="text-gray-400 text-xs font-semibold mt-0.5">Automated compliance tracking logs for municipal security audits.</p>
                  </div>
                  <button 
                    onClick={() => {
                      addSecurityLog("Manual audit trail force refresh requested", 'info');
                      triggerToast("Security logs refreshed", "success");
                    }}
                    className="p-1.5 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin-slow" />
                  </button>
                </div>

                <div className="space-y-3 font-mono">
                  {securityLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 border border-gray-100 rounded-lg text-[11px] leading-relaxed">
                      <span className="text-gray-400 font-bold shrink-0">{log.timestamp}</span>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {log.type === 'success' && <span className="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded border border-green-200 uppercase text-[9px]">[SUCCESS]</span>}
                        {log.type === 'info' && <span className="text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 uppercase text-[9px]">[SYSTEM]</span>}
                        {log.type === 'warn' && <span className="text-[#ba1a1a] font-bold bg-[#ba1a1a]/5 px-1.5 py-0.5 rounded border border-[#ba1a1a]/15 uppercase text-[9px]">[ALERT]</span>}
                      </div>

                      <span className="text-gray-600 font-medium flex-grow">{log.action}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-100/50 rounded-xl border border-gray-200 text-xs text-gray-500 font-semibold leading-relaxed">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <p>
                    Log compliance checked and certified under municipal data protocols. System logs are cryptographically hashed and forwarded daily to the Auditor General's central database at 12:00 AM.
                  </p>
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
