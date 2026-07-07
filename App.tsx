import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardView from './components/DashboardView';
import SubmitComplaintView from './components/SubmitComplaintView';
import TrackingView from './components/TrackingView';
import ResourcesView from './components/ResourcesView';
import ContactView from './components/ContactView';
import AdminPortalView from './components/AdminPortalView';

import { INITIAL_COMPLAINTS } from './data';
import { Complaint } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, Bell } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  
  // Set default active case to the first one shown in screenshot 3
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint>(INITIAL_COMPLAINTS[0]);

  // Toast notifications states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handler for navigation
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Case lookup search engine
  const handleSearchCase = (id: string) => {
    const query = id.trim().toUpperCase();
    const found = complaints.find(c => c.id.toUpperCase() === query);
    
    if (found) {
      setSelectedComplaint(found);
      setCurrentView('tracking');
      triggerToast(`Case ${found.id} located successfully.`, 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      triggerToast(`Tracking ID "${id}" could not be located. Try 'CR-2024-8842' or register a new one.`, 'error');
    }
  };

  // New complaint registration pipeline
  const handleSubmitComplaint = (newComplaint: Complaint) => {
    // Add to list
    setComplaints(prev => [newComplaint, ...prev]);
    // Set active tracking case
    setSelectedComplaint(newComplaint);
    // Switch view directly to Tracking
    setCurrentView('tracking');
    // Success feedback
    triggerToast(`Complaint registered successfully! Tracking ID: ${newComplaint.id}`, 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Request update simulator
  const handleRequestUpdate = (id: string) => {
    triggerToast(`Update requested for case ${id}. Our dispatcher is checking records.`, 'info');
  };

  // Callback to update custom complaint status and logs in the global list
  const handleUpdateComplaint = (updated: Complaint) => {
    setComplaints(prev => prev.map(c => c.id === updated.id ? updated : c));
    if (selectedComplaint && selectedComplaint.id === updated.id) {
      setSelectedComplaint(updated);
    }
  };

  return (
    <div className="min-h-screen civic-background text-[#141b2c] flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Soft Decorative Ambient Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00346f]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#00346f]/3 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] right-[15%] w-[35%] h-[35%] bg-amber-500/3 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      {/* 1. Universal Top Navigation Bar */}
      <Navbar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onSearchCase={handleSearchCase}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {currentView === 'dashboard' && (
              <DashboardView 
                onNavigate={handleNavigate} 
                onSearchCase={handleSearchCase}
                recentComplaints={complaints}
              />
            )}

            {currentView === 'submit-complaint' && (
              <SubmitComplaintView 
                onCancel={() => handleNavigate('dashboard')} 
                onSubmit={handleSubmitComplaint}
              />
            )}

            {currentView === 'tracking' && (
              <TrackingView 
                complaint={selectedComplaint} 
                onNavigate={handleNavigate}
                onRequestUpdate={handleRequestUpdate}
              />
            )}

            {currentView === 'resources' && (
              <ResourcesView />
            )}

            {currentView === 'contact' && (
              <ContactView />
            )}

            {currentView === 'admin-portal' && (
              <AdminPortalView 
                complaints={complaints}
                onUpdateComplaint={handleUpdateComplaint}
                onNavigate={handleNavigate}
                triggerToast={triggerToast}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Universal Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* 4. Elegant Toast Notification System */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 max-w-sm"
          >
            <div className={`p-4 rounded-xl shadow-xl border flex gap-3 items-start bg-white ${
              toast.type === 'success' 
                ? 'border-green-200 ring-2 ring-green-500/10' 
                : toast.type === 'error'
                ? 'border-red-200 ring-2 ring-red-500/10'
                : 'border-blue-200 ring-2 ring-blue-500/10'
            }`}>
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Bell className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />}
              
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-gray-800">
                  {toast.type === 'success' && "Success Notification"}
                  {toast.type === 'error' && "Action Aborted"}
                  {toast.type === 'info' && "Inbound Alert"}
                </h4>
                <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
                  {toast.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
