'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const GoalProgress = () => {
  return (
    <div className="col-span-12 lg:col-span-4 bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 flex flex-col items-center text-center">
      <h2 className="text-2xl font-bold tracking-tight mb-2">Học lặp lại</h2>
      <p className="text-slate-500 text-sm mb-10">Bạn có 15 thẻ mới cần xem lại để duy trì trí nhớ.</p>
      
      <div className="relative w-52 h-52 mb-10 group">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100 stroke-[3]" />
          <circle 
            id="progress-circle" 
            cx="18" 
            cy="18" 
            r="16" 
            fill="none" 
            className="stroke-blue-500 stroke-[3] stroke-linecap-round circle-animate" 
            strokeDasharray="80, 100" 
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
          <span className="text-5xl font-black text-slate-800">80%</span>
          <span className="text-xs text-slate-500 font-bold tracking-wider mt-1 uppercase">Mục tiêu</span>
        </div>
      </div>

      <Button variant="primary" className="w-full mt-auto py-4 text-base font-black shadow-xl shadow-blue-500/20">
        <Play className="w-5 h-5 fill-current" /> Bắt đầu ôn tập
      </Button>
    </div>
  );
};
