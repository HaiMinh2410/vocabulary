"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  BarChart2, 
  Settings, 
  BrainCircuit 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/feed', icon: BookOpen, label: 'Feed' },
  { href: '/review', icon: Target, label: 'Review Mode' },
  { href: '/progress', icon: BarChart2, label: 'Progress' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-100 p-6 flex flex-col sticky top-0 h-screen transition-all duration-300 hidden md:flex">
      <div className="flex items-center gap-3 text-xl font-bold mb-8 text-slate-900">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <span>Vocab OS</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group font-medium ${
                isActive 
                  ? 'text-blue-500 bg-blue-50/50 font-bold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                isActive ? 'text-blue-500' : 'text-slate-400'
              }`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
        <div className="p-0.5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 shadow-sm">
          <img 
            src="https://ui-avatars.com/api/?name=Thanh&background=5B9CFF&color=fff&rounded=true" 
            alt="Avatar" 
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-semibold truncate leading-tight">Thanh Minh</span>
          <span className="text-[11px] text-slate-400 truncate">Cố gắng thêm nhé!</span>
        </div>
      </div>
    </aside>
  );
};
