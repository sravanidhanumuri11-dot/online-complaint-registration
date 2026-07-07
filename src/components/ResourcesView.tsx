import { useState } from 'react';
import { Download, Search, FileText, Info, HelpCircle } from 'lucide-react';
import { HELPFUL_DOCUMENTS } from '../data';
import { motion } from 'motion/react';

export default function ResourcesView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');

  const extraResources = [
    { title: "2026 Public Infrastructure Audit", size: "3.4 MB", type: "PDF", category: "Audits" },
    { title: "Solid Waste Management Guidelines", size: "1.8 MB", type: "PDF", category: "Guidelines" },
    { title: "Municipal Code of Ordinances", size: "12.5 MB", type: "PDF", category: "Legal" },
    { title: "Public Works General Specification", size: "5.2 MB", type: "PDF", category: "Technical" },
    { title: "Citizen Engagement Charter v2.1", size: "1.0 MB", type: "PDF", category: "Charters" },
    { title: "Parks & Recreation Master Plan", size: "8.1 MB", type: "PDF", category: "Audits" }
  ];

  const allResources = [
    ...HELPFUL_DOCUMENTS.map(d => ({ ...d, category: d.title.includes('Zoning') ? 'Maps' : d.title.includes('Rights') ? 'Charters' : 'Guidelines' })),
    ...extraResources
  ];

  const filteredResources = allResources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || res.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'Charters', 'Guidelines', 'Maps', 'Audits', 'Legal', 'Technical'];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 font-sans min-h-screen">
      <div className="space-y-3 mb-10">
        <span className="inline-block py-1 px-3 bg-gray-100 text-[#00346f] font-semibold text-xs rounded-full uppercase tracking-wider">
          Knowledge Repository
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-display">
          Resources &amp; Documents
        </h1>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
          Search, view, and download structural guidelines, planning charters, environmental specifications, and general municipal documents published for citizen access.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents by keyword..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#00346f] focus:outline-none font-medium"
          />
        </div>

        {/* Categories Scroller */}
        <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-all ${
                category === cat
                  ? 'bg-[#00346f] text-white border-[#00346f]'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((doc, idx) => (
          <div 
            key={idx}
            onClick={() => alert(`Initiating simulated secure download for ${doc.title} (${doc.size})...`)}
            className="bg-white border border-gray-200 hover:border-gray-300 p-6 rounded-xl flex flex-col justify-between hover:shadow-md transition-all group cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#f1f3ff] flex items-center justify-center text-[#00346f] mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-gray-900 group-hover:text-[#00346f] transition-colors mb-2 line-clamp-2">
                {doc.title}
              </h3>
              <p className="text-gray-400 text-xs font-semibold mb-4">
                {doc.type} • {doc.size}
              </p>
            </div>

            <div className="border-t border-gray-50 pt-4 flex items-center justify-between text-xs font-bold text-[#00346f]">
              <span className="bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                {doc.category}
              </span>
              <button className="flex items-center gap-1.5 hover:underline shrink-0">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-20 bg-white border border-gray-200 rounded-xl shadow-sm">
          <Info className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="font-bold text-sm text-gray-600">No resources found matching "{searchTerm}"</p>
          <button 
            onClick={() => { setSearchTerm(''); setCategory('All'); }}
            className="text-[#00346f] text-xs font-bold hover:underline mt-2 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Informative Warning box */}
      <div className="mt-12 bg-blue-50/50 rounded-xl border border-[#abc7ff]/30 p-6 flex gap-3">
        <HelpCircle className="w-5 h-5 text-[#00346f] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-xs text-gray-800">Accessibility Information</h4>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            All reports, plans, and technical specification guidelines are certified under federal web accessibility rules. If you require specialized formats (braille, audio overlays, or print translation), please file a support query through our Contact panel.
          </p>
        </div>
      </div>

    </div>
  );
}
