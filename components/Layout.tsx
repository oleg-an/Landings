import React from 'react';
import { PhoneCall, Star, ShieldCheck, Award } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative font-sans">
      {/* Top Banner - Trust Signals */}
      <div className="bg-slate-900 text-white text-[10px] py-1.5 px-4 flex justify-between items-center tracking-wide uppercase font-semibold z-50">
        <span className="flex items-center gap-1"><Star size={10} className="text-yellow-400 fill-yellow-400"/> Rated 4.8/5</span>
        <span className="flex items-center gap-1">20k+ Happy Customers</span>
      </div>

      {/* Header */}
      <header className="bg-white px-5 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-2.5">
          {/* Simplified HomeBuddy Logo Representation */}
          <div className="flex items-center gap-1">
             <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-lg">
               H
             </div>
             <div className="leading-none">
               <h1 className="text-lg font-bold text-slate-900 tracking-tight">HomeBuddy</h1>
               <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase block">Home Improvements</span>
             </div>
          </div>
        </div>
        <a href="tel:+15550000000" className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-full font-semibold text-sm hover:bg-blue-100 transition-colors">
          <PhoneCall size={16} />
          <span className="hidden sm:inline">Call Now</span>
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-white relative">
        {children}
      </main>

      {/* Footer Trust Section */}
      <footer className="bg-slate-50 p-6 pb-24 text-center border-t border-slate-200">
        <div className="flex justify-center gap-6 mb-4 opacity-70">
           <div className="flex flex-col items-center gap-1">
              <ShieldCheck size={20} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Lifetime Warranty</span>
           </div>
           <div className="flex flex-col items-center gap-1">
              <Award size={20} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">Certified Pros</span>
           </div>
        </div>
        <p className="text-slate-400 text-xs">
          © 2024 HomeBuddy. Your partner in home comfort.
        </p>
      </footer>
    </div>
  );
};