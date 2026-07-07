import React, { useState } from 'react';
import { ArrowRight, BarChart2, CheckCircle2, Search, FileText, Activity, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { HERO_IMAGE, QUICK_METRICS } from '../data';
import { Complaint } from '../types';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onSearchCase: (id: string) => void;
  recentComplaints: Complaint[];
}

export default function DashboardView({ onNavigate, onSearchCase, recentComplaints }: DashboardViewProps) {
  const [trackId, setTrackId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    
    // Attempt search
    onSearchCase(trackId.trim());
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full font-sans"
    >
      {/* 1. Hero Section */}
      <section className="relative bg-white pt-10 pb-20 overflow-hidden border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 z-10">
            <span className="inline-block py-1 px-3 bg-gray-100 text-[#00346f] font-semibold text-xs rounded-full uppercase tracking-wider">
              Public Service Excellence
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight font-display">
              Empowering Communities Through Transparent Resolution
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
              CivicResolve provides a direct, accountable bridge between citizens and government. Track progress in real-time, hold departments accountable, and build a better city together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={() => onNavigate('submit-complaint')}
                className="bg-[#00346f] text-white px-8 py-4 rounded-lg font-semibold text-sm hover:bg-[#004a99] transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
              >
                Submit a Complaint <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('impact-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-gray-200 text-[#00346f] bg-white px-8 py-4 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                View Public Reports <BarChart2 className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center font-bold text-[10px] text-blue-700">JS</div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-green-100 flex items-center justify-center font-bold text-[10px] text-green-700">MT</div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center font-bold text-[10px] text-purple-700">AH</div>
              </div>
              <p className="text-xs font-medium text-gray-500">Joined by over 15,000 active residents this month</p>
            </div>
          </div>

          {/* Right Column (Hero Image) */}
          <div className="lg:col-span-5 relative h-[380px] sm:h-[450px]">
            <div className="absolute inset-0 bg-[#d7e2ff] rounded-2xl transform rotate-3 scale-95 opacity-50"></div>
            <div className="relative h-full w-full rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
              <img 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
                src={HERO_IMAGE} 
                alt="Modern civic building"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. Search & Track Bar Section */}
      <section className="py-10 bg-[#00346f] text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold font-display mb-1">Track an Existing Complaint</h2>
            <p className="text-[#abc7ff] text-sm font-medium">Enter your resolution ID to see live progress and updates.</p>
          </div>
          
          <div className="md:w-1/2 w-full">
            <form onSubmit={handleTrackSearch} className="flex bg-white rounded-lg overflow-hidden p-1.5 shadow-md">
              <input 
                type="text"
                value={trackId}
                onChange={(e) => {
                  setTrackId(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="e.g. CR-2024-8842 or CR-8829-2024"
                className="flex-grow border-none focus:ring-0 px-4 text-gray-800 font-medium text-sm focus:outline-none"
              />
              <button 
                type="submit"
                className="bg-[#004a99] hover:bg-[#00346f] text-white px-6 py-3 rounded-md font-semibold text-xs flex items-center gap-2 transition-all duration-200 shrink-0 cursor-pointer"
              >
                <Activity className="w-4 h-4" /> Find Case
              </button>
            </form>
            {errorMsg && (
              <p className="text-red-300 text-xs mt-2 ml-2 font-medium">{errorMsg}</p>
            )}
          </div>
        </div>
      </section>

      {/* 3. Steps (Bento Style) */}
      <section className="py-20 bg-gray-50 px-6 md:px-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 font-display mb-3">Transparent Accountability in 3 Steps</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
              Our streamlined process ensures every voice is heard and every issue is addressed by the right department.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-[#d7e2ff] rounded-xl flex items-center justify-center text-[#00346f] mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">1. Submit</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Report an issue using our smart form. Attach photos and geolocate the problem automatically for faster dispatching.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs font-semibold text-gray-600 border-t border-gray-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00346f]" /> Anonymous options
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00346f]" /> Photo uploads
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-[#dce3eb] rounded-xl flex items-center justify-center text-gray-700 mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">2. Track</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Receive a tracking ID instantly. Watch as your request moves from 'Pending' to 'In Progress' with real-time timestamps.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs font-semibold text-gray-600 border-t border-gray-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00346f]" /> Live dashboard
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00346f]" /> Department assignees
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-[#d9e3fb] rounded-xl flex items-center justify-center text-gray-800 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">3. Resolve</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Confirm the resolution once the work is complete. Provide feedback to help us improve the quality of civic services.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs font-semibold text-gray-600 border-t border-gray-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00346f]" /> Outcome verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00346f]" /> Resident satisfaction
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Impact in Numbers & Live Resolutions */}
      <section id="impact-section" className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Stats (Left Side) */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 font-display">Impact in Numbers</h2>
              <p className="text-gray-600 text-base leading-relaxed">
                We believe in radical transparency. Our data is open, public, and updated every hour to show how we're making the community better.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {QUICK_METRICS.map((stat, idx) => (
                  <div key={idx} className="p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                    <span className="block text-3xl font-extrabold text-[#00346f] mb-1 font-display">{stat.value}</span>
                    <span className="font-sans text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.sublabel}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Resolutions Table (Right Side) */}
            <div className="lg:col-span-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-semibold text-sm text-gray-900">Recent Public Resolutions</h3>
                <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
                  Live <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3.5 font-bold text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-5 py-3.5 font-bold text-gray-500 uppercase tracking-wider">Issue</th>
                      <th className="px-5 py-3.5 font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentComplaints.slice(0, 4).map((c) => (
                      <tr 
                        key={c.id} 
                        onClick={() => onSearchCase(c.id)}
                        className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                      >
                        <td className="px-5 py-4 font-semibold text-gray-800">{c.department}</td>
                        <td className="px-5 py-4 text-gray-600 group-hover:text-[#00346f] group-hover:underline font-medium flex items-center gap-1.5">
                          {c.category}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            c.status === 'Resolved'
                              ? 'bg-blue-50 text-[#00346f] border border-blue-100'
                              : 'bg-yellow-50 text-yellow-800 border border-yellow-100'
                          }`}>
                            {c.status === 'Resolved' ? 'RESOLVED' : 'IN PROGRESS'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="p-4 text-center border-t border-gray-100 bg-gray-50">
                <button 
                  onClick={() => onNavigate('resources')}
                  className="font-semibold text-xs text-[#00346f] hover:underline cursor-pointer"
                >
                  View All Resolutions
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="py-16 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto bg-[#004a99] rounded-3xl p-8 md:p-16 flex flex-col items-center text-center text-white relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-radial-gradient from-[#00346f] to-transparent opacity-50"></div>
          <div className="relative z-10 space-y-6 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight">Ready to make a difference?</h2>
            <p className="text-[#abc7ff] opacity-90 text-sm md:text-base leading-relaxed">
              Join thousands of residents using CivicResolve to improve their neighborhoods every day.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <button 
                onClick={() => onNavigate('submit-complaint')}
                className="bg-white text-[#00346f] px-8 py-4 rounded-lg font-bold text-sm hover:scale-105 transition-transform duration-200 cursor-pointer shadow-md"
              >
                Get Started Now
              </button>
              <button 
                onClick={() => onNavigate('resources')}
                className="bg-transparent border border-[#abc7ff] text-white hover:bg-white/10 px-8 py-4 rounded-lg font-bold text-sm transition-colors duration-200 cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
