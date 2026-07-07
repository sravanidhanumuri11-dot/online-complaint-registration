import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Plus, Minus, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is a Civic Tracking ID and where do I find it?",
      a: "A Civic Tracking ID is a unique key (e.g. CR-8829-2024) generated instantly whenever you submit a complaint on this portal. It is sent to your email and displays on the confirmation screen. You can input this key in the tracking bar on the homepage to pull up real-time statuses."
    },
    {
      q: "Can I submit complaints completely anonymously?",
      a: "Yes! Step 1 of the filing process includes an option to remain anonymous. Selecting this checkbox hides your name and contact details from the public ledger, although verified municipal managers can still access details to contact you in critical safety scenarios."
    },
    {
      q: "How long does a general pothole or street light repair take?",
      a: "Public Works dispatches inspectors within 3 business days of verification. Minor issues are resolved within 5-10 business days, while complicated major structural or sewage overhauls can take up to 20-30 business days depending on budgetary spec guidelines."
    },
    {
      q: "How do I provide feedback once an issue is resolved?",
      a: "When your tracking ID enters the 'Resolved' state, a rating scale and description field will automatically activate in your tracking dashboard. Your satisfaction feedback directly impacts our public department accountability metrics."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  const departments = [
    { name: "Public Works Intake Office", email: "pw-intake@civicportal.gov", phone: "+1 (555) 011-2233", hours: "Mon - Fri, 8AM - 5PM" },
    { name: "Parks & Recreation", email: "parks@civicportal.gov", phone: "+1 (555) 011-4455", hours: "Mon - Fri, 9AM - 4PM" },
    { name: "Emergency Dispatch & Safety", email: "dispatch@civicportal.gov", phone: "+1 (555) 011-9999", hours: "24/7 Availability" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 font-sans min-h-screen">
      <div className="space-y-3 mb-12">
        <span className="inline-block py-1 px-3 bg-gray-100 text-[#00346f] font-semibold text-xs rounded-full uppercase tracking-wider">
          Citizen Assistance
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display">
          Contact Us
        </h1>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
          Connect directly with department heads, submit generic questions to the Civic intake committee, or browse our expanding database of FAQs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Form & FAQs (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-10">
          
          {/* General Inquiry Form Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm relative">
            
            {submitted && (
              <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center z-20 p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Message Dispatched!</h3>
                <p className="text-gray-500 text-xs max-w-sm leading-relaxed font-medium">
                  Thank you for your inquiry. A representative from the Civic Support intake committee will review your query and reply within 1-2 business days.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-[#00346f] hover:underline pt-2 cursor-pointer"
                >
                  Submit Another Message
                </button>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center z-15">
                <div className="w-10 h-10 border-4 border-[#00346f] border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <h3 className="font-bold text-lg text-gray-900 font-display mb-6">Send an Inquiry</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/10 focus:border-[#00346f] focus:outline-none transition-all font-medium"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eleanor@example.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/10 focus:border-[#00346f] focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Accessibility formatting or municipal data request"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/10 focus:border-[#00346f] focus:outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message Description</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message with any specific context or question..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[#00346f]/10 focus:border-[#00346f] focus:outline-none transition-all resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                className="bg-[#00346f] hover:bg-[#004a99] text-white px-6 py-3.5 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer active:scale-95 shadow-sm"
              >
                <Send className="w-4 h-4" /> Dispatch Message
              </button>
            </form>
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 font-display">Frequently Asked Questions</h3>
            
            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-5 text-left font-bold text-sm text-gray-800 flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <Minus className="w-4 h-4 text-gray-400 shrink-0" /> : <Plus className="w-4 h-4 text-gray-400 shrink-0" />}
                    </button>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="p-5 pt-0 text-xs text-gray-500 leading-relaxed border-t border-gray-50 font-medium">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Departments & Details (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Department Directory Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-gray-900 font-display border-b border-gray-50 pb-3">Departmental Directory</h3>
            
            <div className="space-y-5">
              {departments.map((dept, idx) => (
                <div key={idx} className="space-y-2 text-xs">
                  <h4 className="font-bold text-gray-800">{dept.name}</h4>
                  <div className="space-y-1.5 text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <a href={`mailto:${dept.email}`} className="hover:text-[#00346f] hover:underline">{dept.email}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{dept.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{dept.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Central Office Map Details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-base text-gray-900 font-display border-b border-gray-50 pb-3">Central Office Address</h3>
            
            <div className="space-y-3 font-medium text-gray-500">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <span>
                  Civic Center Plaza, Building 4<br />
                  Suite 1200, Downtown Sector<br />
                  City of New York, NY 10001
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
