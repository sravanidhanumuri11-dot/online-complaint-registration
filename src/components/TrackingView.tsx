import React, { useState } from 'react';
import { 
  ChevronRight, Download, Send, Phone, Mail, 
  MapPin, Plus, Minus, Check, Clock, AlertCircle, FileText, ShieldAlert,
  MessageSquare, User, HelpCircle, X
} from 'lucide-react';
import { SECTOR_MAP, HELPFUL_DOCUMENTS } from '../data';
import { Complaint } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface TrackingViewProps {
  complaint: Complaint;
  onNavigate: (view: string) => void;
  onRequestUpdate: (id: string) => void;
}

export default function TrackingView({ complaint, onNavigate, onRequestUpdate }: TrackingViewProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    { sender: 'agent', text: "Hello! Thank you for contacting CivicPortal live assistance. How can I help you regarding your complaint today?", time: "Just Now" }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updateRequestSubmitted, setUpdateRequestSubmitted] = useState(false);

  // Chat Submission handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = { sender: 'user' as const, text: newMessage.trim(), time: "Just Now" };
    setChatMessages(prev => [...prev, userMsg]);
    setNewMessage('');

    // Simulated Response
    setTimeout(() => {
      const agentMsg = {
        sender: 'agent' as const,
        text: `Thank you. I have pulled up your case: ${complaint.id}. Our officer, ${complaint.officer.name}, has noted this query and will reach out shortly. Is there anything else I can assist you with?`,
        time: "Just Now"
      };
      setChatMessages(prev => [...prev, agentMsg]);
    }, 1000);
  };

  const handleUpdateClick = () => {
    setUpdateRequestSubmitted(true);
    onRequestUpdate(complaint.id);
    setTimeout(() => {
      setUpdateRequestSubmitted(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 font-sans relative">
      
      {/* 1. Breadcrumbs & Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <nav className="flex items-center gap-1 text-gray-400 font-semibold text-xs mb-3 uppercase tracking-wider">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-[#00346f] transition-colors">Cases</button>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <span className="text-[#00346f]">Tracking</span>
          </nav>
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display">
            Case Tracking: {complaint.id}
          </h1>
          <p className="text-gray-500 font-medium text-sm md:text-base mt-1">
            {complaint.category} reported in {complaint.locationDetails || complaint.address}.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3">
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                + "ID,Category,Department,Status,Created At\n"
                + `${complaint.id},${complaint.category},${complaint.department},${complaint.status},${complaint.createdAt}`;
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `Report_${complaint.id}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-5 py-2.5 bg-white border border-gray-300 text-[#00346f] hover:bg-gray-50 font-semibold text-sm rounded-lg shadow-sm transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Report
          </button>
          
          <div className="relative">
            <button 
              onClick={handleUpdateClick}
              className="px-5 py-2.5 bg-[#00346f] hover:bg-[#004a99] text-white font-semibold text-sm rounded-lg shadow-sm transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              Request Update
            </button>
            
            {/* Soft inline popup when update is requested */}
            {updateRequestSubmitted && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-72 bg-green-50 border border-green-200 p-4 rounded-xl shadow-lg z-10"
              >
                <div className="flex gap-2">
                  <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-green-800">Request Dispatched!</h4>
                    <p className="text-[10px] text-green-600 leading-normal font-medium mt-0.5">
                      An alert has been sent to {complaint.officer.name}. You will be notified by email once they log a status revision.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column (8 cols on desktop) */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Bento Grid Sub-row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Status History Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-[#00346f] font-display">Status History</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  complaint.status === 'Resolved'
                    ? 'bg-blue-50 text-[#00346f] border border-blue-100'
                    : complaint.status === 'In Progress'
                    ? 'bg-yellow-50 text-yellow-800 border border-yellow-100 animate-pulse'
                    : 'bg-gray-50 text-gray-600 border border-gray-200'
                }`}>
                  {complaint.status}
                </span>
              </div>
              
              {/* Timeline Items */}
              <div className="space-y-6 relative pl-8 ml-2 flex-grow">
                {/* Vertical Connector Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                
                {complaint.history.map((event, idx) => {
                  const isLast = idx === complaint.history.length - 1;
                  return (
                    <div key={idx} className={`relative group ${!event.completed ? 'opacity-50' : ''}`}>
                      {/* Left Dot Indicator */}
                      <div className={`absolute -left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center z-10 border transition-all ${
                        event.completed 
                          ? 'bg-[#00346f] border-[#00346f] text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {event.completed ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>
                      
                      <div>
                        <p className={`text-sm ${event.completed ? 'font-bold text-gray-900' : 'font-semibold text-gray-400'}`}>
                          {event.title}
                        </p>
                        <p className="text-gray-400 text-xs font-semibold mt-0.5">{event.timestamp}</p>
                        {event.description && (
                          <p className="text-gray-600 text-xs mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed font-medium">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Incident Map Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
              <div className="p-5 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-lg text-gray-900 font-display">Incident Area</h3>
                <p className="text-gray-400 text-xs font-semibold mt-0.5">
                  {complaint.locationDetails || complaint.address}
                </p>
              </div>
              
              <div className="flex-grow relative min-h-[280px] overflow-hidden bg-gray-100">
                <img 
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="w-full h-full object-cover transition-transform duration-300" 
                  src={SECTOR_MAP} 
                  alt="Incident location topographical map"
                />
                
                {/* Floating Map Pin Marker */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-[#00346f] text-white px-2 py-1 rounded-md shadow-lg flex items-center gap-1.5 text-[10px] font-bold pointer-events-auto hover:scale-105 transition-transform border border-[#abc7ff]/20">
                    <MapPin className="w-3 h-3 text-red-400" /> Exact Spot
                  </div>
                </div>

                {/* Floating Controls */}
                <div className="absolute bottom-4 right-4 bg-white p-1 rounded-lg shadow-md border border-gray-200 flex flex-col gap-1">
                  <button 
                    onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded text-gray-600 active:scale-90 transition-transform cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <div className="h-px bg-gray-100 mx-1"></div>
                  <button 
                    onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded text-gray-600 active:scale-90 transition-transform cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Departmental Details Table Card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-lg text-gray-900 font-display">Departmental Details</h3>
              
              {/* Assigned Officer badge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-800">{complaint.officer.name}</p>
                  <p className="text-gray-400 text-xs font-semibold">{complaint.officer.title}</p>
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d7e2ff] shadow-sm">
                  <img 
                    className="w-full h-full object-cover" 
                    src={complaint.officer.avatar} 
                    alt="Case Officer avatar"
                  />
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-gray-50 border-b border-gray-150">
                  <tr>
                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider">Metric ID</th>
                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 font-bold text-gray-400 uppercase tracking-wider">Department</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                  {complaint.metrics.map((metric, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-[#f9f9ff]' : 'bg-white'}>
                      <td className="px-6 py-4 font-bold text-[#00346f]">{metric.metricId}</td>
                      <td className="px-6 py-4 text-gray-600 leading-relaxed max-w-sm">{metric.description}</td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${
                          metric.priority === 'High' 
                            ? 'text-[#ba1a1a]' 
                            : metric.priority === 'Medium' 
                            ? 'text-amber-600' 
                            : 'text-green-600'
                        }`}>
                          {metric.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{metric.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols on desktop) */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Helpful Documents Download Box */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 font-display mb-4">Helpful Documents</h3>
            
            <div className="space-y-4">
              {HELPFUL_DOCUMENTS.map((doc, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    alert(`Initiating simulated download for ${doc.title} (${doc.size})...`);
                  }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-200 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-[#00346f] shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="font-bold text-sm text-gray-800 truncate group-hover:text-[#00346f] transition-colors">{doc.title}</p>
                    <p className="text-gray-400 text-xs font-semibold">{doc.type} • {doc.size}</p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-[#00346f] transition-colors shrink-0" />
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigate('resources')}
              className="w-full mt-6 py-3 border border-gray-300 text-[#00346f] font-bold text-xs rounded-lg hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
            >
              Browse All Resources
            </button>
          </div>

          {/* Assistant Blue Sidebar Box */}
          <div className="bg-[#00346f] text-white rounded-xl p-6 relative overflow-hidden shadow-md">
            
            {/* Soft backdrop vector illustration */}
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
              <MessageSquare className="w-44 h-44" />
            </div>

            <div className="relative z-10 space-y-4">
              <h4 className="font-bold text-lg font-display">Need Assistance?</h4>
              <p className="text-[#abc7ff] text-xs leading-relaxed font-medium">
                Our support team is available 24/7 to help you with case inquiries and portal navigation.
              </p>
              
              <div className="space-y-2.5 text-xs font-semibold text-white pt-2">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#abc7ff]" />
                  <span>1-800-CIVIC-HELP</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#abc7ff]" />
                  <span>support@civicportal.gov</span>
                </div>
              </div>

              <button 
                onClick={() => setShowLiveChat(true)}
                className="mt-4 w-full bg-white text-[#00346f] hover:bg-[#d7e2ff] py-3 rounded-lg font-bold text-xs transition-colors duration-200 active:scale-95 cursor-pointer shadow-sm"
              >
                Start Live Chat
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Interactive Live Chat Assistant Widget */}
      <AnimatePresence>
        {showLiveChat && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 h-[450px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 font-sans"
          >
            {/* Header */}
            <div className="bg-[#00346f] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></div>
                <div>
                  <h4 className="font-bold text-xs">Live Case Assistant</h4>
                  <p className="text-[10px] text-[#abc7ff] font-medium">Connecting you to Civic Affairs</p>
                </div>
              </div>
              <button 
                onClick={() => setShowLiveChat(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Message Body */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-gray-50 flex flex-col">
              {chatMessages.map((msg, idx) => {
                const isAgent = msg.sender === 'agent';
                return (
                  <div 
                    key={idx} 
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isAgent 
                        ? 'bg-white text-gray-800 border border-gray-100 self-start rounded-tl-none' 
                        : 'bg-[#00346f] text-white self-end rounded-tr-none'
                    }`}
                  >
                    <p className="font-medium">{msg.text}</p>
                    <span className={`text-[9px] mt-1 block text-right ${isAgent ? 'text-gray-400' : 'text-[#abc7ff]'}`}>
                      {msg.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-150 bg-white flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask your officer a question..."
                className="flex-grow px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#00346f] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#00346f] hover:bg-[#004a99] text-white p-2.5 rounded-lg active:scale-95 transition-transform cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
