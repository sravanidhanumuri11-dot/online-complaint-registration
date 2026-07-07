interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 text-gray-600 font-sans text-xs">
      <div className="w-full py-6 px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <span 
            onClick={() => onNavigate('dashboard')}
            className="text-gray-900 font-bold text-sm cursor-pointer hover:text-[#00346f]"
          >
            CivicPortal
          </span>
          <span className="text-gray-500 text-center md:text-left">
            &copy; 2026 Department of Civic Affairs. All rights reserved.
          </span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <button 
            onClick={() => onNavigate('privacy-policy')}
            className="text-gray-500 hover:text-[#00346f] transition-all hover:underline"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => onNavigate('terms')}
            className="text-gray-500 hover:text-[#00346f] transition-all hover:underline"
          >
            Terms of Service
          </button>
          <button 
            onClick={() => onNavigate('accessibility')}
            className="text-gray-500 hover:text-[#00346f] transition-all hover:underline"
          >
            Accessibility Statement
          </button>
          <button 
            onClick={() => onNavigate('open-data')}
            className="text-gray-500 hover:text-[#00346f] transition-all hover:underline"
          >
            Open Data Portal
          </button>
          <button 
            onClick={() => onNavigate('admin-portal')}
            className="text-gray-500 font-bold hover:text-[#00346f] transition-all hover:underline"
          >
            Official Admin Portal
          </button>
        </div>
      </div>
    </footer>
  );
}
