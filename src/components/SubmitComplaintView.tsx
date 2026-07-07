import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Shield, Clock, CheckCircle, Upload, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { DEPARTMENTS } from '../data';
import { Complaint } from '../types';

interface SubmitComplaintViewProps {
  onCancel: () => void;
  onSubmit: (newComplaint: Complaint) => void;
}

export default function SubmitComplaintView({ onCancel, onSubmit }: SubmitComplaintViewProps) {
  const [step, setStep] = useState(1);
  
  // Step 1 states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [civicId, setCivicId] = useState('');
  const [address, setAddress] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  // Step 2 states
  const [selectedDept, setSelectedDept] = useState(DEPARTMENTS[0].name);
  const [selectedIssue, setSelectedIssue] = useState(DEPARTMENTS[0].issues[0]);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [locationDetails, setLocationDetails] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep1 = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Full Legal Name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid Email Address is required';
    if (!phone.trim()) errs.phone = 'Primary Phone Number is required';
    if (!address.trim()) errs.address = 'Residential Address is required';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: { [key: string]: string } = {};
    if (!description.trim()) errs.description = 'Please provide a detailed description of the issue';
    if (!locationDetails.trim()) errs.locationDetails = 'Please specify the exact spot or neighborhood';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      // Auto-set first issue when switching department if needed
      const deptObj = DEPARTMENTS.find(d => d.name === selectedDept);
      if (deptObj && !deptObj.issues.includes(selectedIssue)) {
        setSelectedIssue(deptObj.issues[0]);
      }
    }
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      setStep(3);
    }
  };

  const handleDeptChange = (deptName: string) => {
    setSelectedDept(deptName);
    const deptObj = DEPARTMENTS.find(d => d.name === deptName);
    if (deptObj && deptObj.issues.length > 0) {
      setSelectedIssue(deptObj.issues[0]);
    }
  };

  // Mock File Upload Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setPhotoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmitFinal = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      // Create random complaint ID
      const randomYear = 2026;
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const generatedId = `CR-${randomDigits}-${randomYear}`;

      const newComplaint: Complaint = {
        id: generatedId,
        fullName: anonymous ? "Anonymous Resident" : fullName,
        email: email,
        phone: phone,
        civicId: civicId || undefined,
        address: address,
        anonymous: anonymous,
        department: selectedDept,
        category: selectedIssue,
        description: description,
        priority: priority,
        status: 'Pending',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        locationDetails: locationDetails,
        history: [
          {
            title: "Complaint Filed",
            timestamp: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • Just Now`,
            status: "Pending",
            completed: true
          },
          {
            title: "Review Pending",
            timestamp: "Awaiting assigned Case Officer",
            status: "Pending",
            completed: false
          }
        ],
        metrics: [
          {
            metricId: `MET-${Math.floor(100 + Math.random() * 900)}`,
            description: selectedIssue,
            priority: priority,
            department: selectedDept
          }
        ],
        officer: {
          name: "Unassigned",
          title: "Intake Representative",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCojxRm8jFKWHIyePaX6Yj6UOdNzKUTiFcRNGhkFkMDn8YrAT3ojHYBJrtO_26FRV-H8CWMwE1twsFSDIFsq3nFi9329TkFwuqv4U5nB2nSZhLbPKUqXzsporjX15sX8AgRw0zta9IB1rBuGP_kKewP5Wptq1qyaHWgO8mNwL4F3p62jPHu_yRXTvLs6sVWnpWDEeVn3PQbRY9YMgSvcUks5ONlIHL-v1dkQ5Qqh05r1RR60-L_nJovh8AjuG3adAJuu4YlJYoYdwRe" // generic placeholder avatar
        }
      };

      setIsSubmitting(false);
      onSubmit(newComplaint);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 font-sans min-h-screen">
      
      {/* Progress Indicators */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            <span className="font-semibold text-xs text-[#00346f] uppercase tracking-wider">
              Step {step} of 3
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 font-display">
              {step === 1 && "Personal Details"}
              {step === 2 && "Complaint Details"}
              {step === 3 && "Review Submission"}
            </h1>
          </div>
        </div>

        {/* Dynamic Progress Bars */}
        <div className="flex gap-4 w-full">
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-[#00346f]' : 'bg-gray-200'}`}></div>
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-[#00346f]' : 'bg-gray-200'}`}></div>
          <div className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-[#00346f]' : 'bg-gray-200'}`}></div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-10 shadow-sm relative">
        
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/90 rounded-xl flex flex-col items-center justify-center z-20 space-y-4">
            <div className="w-12 h-12 border-4 border-[#00346f] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-semibold text-sm text-gray-800">Registering report with Civic Authority...</p>
          </div>
        )}

        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-8">
            <div>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
                Please provide your contact information. This ensures our civic representatives can follow up with you regarding the status of your complaint.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Legal Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="fullName">Full Legal Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alexander Hamilton"
                  className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/20 focus:border-[#00346f] focus:outline-none transition-all ${
                    errors.fullName ? 'border-red-400 focus:ring-red-500/10' : 'border-gray-200'
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-xs font-medium">{errors.fullName}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alexander@example.gov"
                  className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/20 focus:border-[#00346f] focus:outline-none transition-all ${
                    errors.email ? 'border-red-400 focus:ring-red-500/10' : 'border-gray-200'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email}</p>}
              </div>

              {/* Primary Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="phone">Primary Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/20 focus:border-[#00346f] focus:outline-none transition-all ${
                    errors.phone ? 'border-red-400 focus:ring-red-500/10' : 'border-gray-200'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs font-medium">{errors.phone}</p>}
              </div>

              {/* Civic / Voter ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="civicId">Civic ID / Voter ID (Optional)</label>
                <input
                  type="text"
                  id="civicId"
                  value={civicId}
                  onChange={(e) => setCivicId(e.target.value)}
                  placeholder="ID-0000000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/20 focus:border-[#00346f] focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Address Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="address">Residential Address</label>
              <textarea
                id="address"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street name, Building number, Apt/Suite, City, State, Zip code"
                className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/20 focus:border-[#00346f] focus:outline-none transition-all resize-none ${
                  errors.address ? 'border-red-400 focus:ring-red-500/10' : 'border-gray-200'
                }`}
              />
              {errors.address && <p className="text-red-500 text-xs font-medium">{errors.address}</p>}
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <input
                type="checkbox"
                id="anon"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-[#00346f] focus:ring-[#00346f]"
              />
              <label className="text-sm font-medium text-gray-600 cursor-pointer" htmlFor="anon">
                I wish to remain anonymous in the public record. Note: Officials may still see your details for verification purposes.
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border-2 border-gray-200 text-gray-500 font-bold text-sm rounded-lg hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-[#00346f] text-white font-bold text-sm rounded-lg hover:bg-[#004a99] transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Next: Complaint Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Complaint Details */}
        {step === 2 && (
          <form onSubmit={handleNextStep2} className="space-y-8">
            <div>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
                Please categorize your civic issue and describe it with as much detail as possible. Specifying accurate locations expedites dispatch times.
              </p>
            </div>

            {/* Department & Issue selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Responsible Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => handleDeptChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/20 focus:border-[#00346f] focus:outline-none transition-all"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Dynamic Issue Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Issue Category</label>
                <select
                  value={selectedIssue}
                  onChange={(e) => setSelectedIssue(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/20 focus:border-[#00346f] focus:outline-none transition-all"
                >
                  {(DEPARTMENTS.find(d => d.name === selectedDept)?.issues || []).map((issue, idx) => (
                    <option key={idx} value={issue}>{issue}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Location Details */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="locationDetails">Exact Location / Sector</label>
              <input
                type="text"
                id="locationDetails"
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder="e.g. Sector 7-B Public Park, Corner of 5th Ave and High Street"
                className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/20 focus:border-[#00346f] focus:outline-none transition-all ${
                  errors.locationDetails ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.locationDetails && <p className="text-red-500 text-xs font-medium">{errors.locationDetails}</p>}
            </div>

            {/* Incident Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="description">Detailed Description of Incident</label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the depth of the issue. E.g. Pothole is approximately 4 inches deep and 2 feet wide..."
                className={`w-full px-4 py-3 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/20 focus:border-[#00346f] focus:outline-none transition-all resize-none ${
                  errors.description ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.description && <p className="text-red-500 text-xs font-medium">{errors.description}</p>}
            </div>

            {/* Priority Level Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Priority Level</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPriority(lvl)}
                    className={`py-3.5 rounded-lg border text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                      priority === lvl
                        ? 'bg-blue-50 text-[#00346f] border-[#00346f] ring-2 ring-[#00346f]/10'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {lvl} Priority
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop File Upload */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Photo Documentation (Optional)</label>
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive ? 'border-[#00346f] bg-[#f1f3ff]' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <input
                  type="file"
                  id="photoUpload"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <label htmlFor="photoUpload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-10 h-10 text-gray-400 mb-1" />
                  {photoFile ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-[#00346f]">{photoFile.name}</p>
                      <p className="text-xs text-gray-400">{(photoFile.size / 1024 / 1024).toFixed(2)} MB • Click to replace</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-gray-700">Drag & drop your image here, or <span className="text-[#00346f] hover:underline">browse files</span></p>
                      <p className="text-xs text-gray-400">Supports PNG, JPG, JPEG up to 10MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-500 font-bold text-sm rounded-lg hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Step 1
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-[#00346f] text-white font-bold text-sm rounded-lg hover:bg-[#004a99] transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Next: Review Submission <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
                Please review your complaint submission. Ensuring that all values are correct will help our case officers dispatch services more effectively.
              </p>
            </div>

            {/* Review Cards */}
            <div className="space-y-6">
              
              {/* Personal Details */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-150">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Personal Details Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-xs font-semibold text-gray-400">Contact Name</span>
                    <span className="font-bold text-gray-800">{anonymous ? "Anonymous Submission" : fullName}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400">Email Address</span>
                    <span className="font-medium text-gray-700">{email}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400">Phone Number</span>
                    <span className="font-medium text-gray-700">{phone}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400">Civic ID / Voter ID</span>
                    <span className="font-medium text-gray-700">{civicId || "None Provided"}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-xs font-semibold text-gray-400">Home Address</span>
                    <span className="font-medium text-gray-700">{address}</span>
                  </div>
                </div>
              </div>

              {/* Issue Details */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-150">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Complaint Details Summary</h4>
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-semibold text-gray-400">Department Assignee</span>
                      <span className="font-bold text-gray-800">{selectedDept}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-400">Issue Category</span>
                      <span className="font-bold text-[#00346f]">{selectedIssue}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-400">Exact Location Details</span>
                      <span className="font-medium text-gray-700">{locationDetails}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-gray-400">Priority Tier</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                        priority === 'High' ? 'bg-red-50 text-red-700' : priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                      }`}>
                        {priority} Priority
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-400">Detailed Problem Description</span>
                    <p className="font-medium text-gray-700 whitespace-pre-wrap">{description}</p>
                  </div>
                  {photoFile && (
                    <div>
                      <span className="block text-xs font-semibold text-gray-400 mb-1">Attached Documentation</span>
                      <div className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg max-w-xs">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-700 truncate">{photoFile.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Legal Warning Panel */}
            <div className="flex items-start gap-3 bg-[#e0e8ff] p-5 rounded-xl border border-[#abc7ff]/50">
              <CheckCircle2 className="w-6 h-6 text-[#00346f] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-[#00346f] mb-1">Declaration of Intent</h4>
                <p className="text-xs text-[#004a99] leading-relaxed font-medium">
                  By clicking "Submit Complaint & Track" below, you verify that the reported damage matches local infrastructure conditions and that you are filing this report in good faith. False filings are punishable by municipal policy guidelines.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-500 font-bold text-sm rounded-lg hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Step 2
              </button>
              <button
                type="button"
                onClick={handleSubmitFinal}
                className="flex items-center gap-2 px-8 py-4 bg-[#00346f] text-white font-bold text-sm rounded-lg hover:bg-[#004a99] hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Submit Complaint &amp; Track <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Helpful Information Panels (Visible Below the Card) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-[#d7e2ff]/30 rounded-xl flex items-start gap-3 border border-[#abc7ff]/20">
          <Shield className="w-5 h-5 text-[#00346f] mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs text-gray-800">Data Privacy Guaranteed</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Your personal identifier is fully encrypted and handled per federal public record standards.</p>
          </div>
        </div>

        <div className="p-5 bg-[#dce3eb]/40 rounded-xl flex items-start gap-3 border border-gray-200/50">
          <Clock className="w-5 h-5 text-gray-700 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs text-gray-800">Swift Response Times</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Most general filings are assigned to local service dispatch teams within 3-5 business days.</p>
          </div>
        </div>

        <div className="p-5 bg-[#d9e3fb]/30 rounded-xl flex items-start gap-3 border border-[#bdc7de]/20">
          <CheckCircle className="w-5 h-5 text-gray-800 mt-0.5 shrink-0" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs text-gray-800">Official Verification</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Accuracy speeds up our verification pipeline and prioritizes catastrophic structural reports.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
