import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  Icon: LucideIcon;
  variant?: 'blue' | 'orange' | 'yellow';
}

export const StatCard = ({ title, value, trend, Icon, variant = 'blue' }: StatCardProps) => {
  const themes = {
    blue: "bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-blue-500/20",
    orange: "bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-orange-500/20",
    yellow: "bg-gradient-to-br from-yellow-300 to-yellow-500 text-slate-800 shadow-yellow-500/20",
  };

  const iconStyles = {
    blue: "bg-white/20",
    orange: "bg-white/20",
    yellow: "bg-black/5 text-slate-700",
  };

  return (
    <div className={clsx(
      "col-span-12 lg:col-span-4 p-8 rounded-[24px] relative overflow-hidden shadow-2xl transition-all hover:scale-[1.02] group",
      themes[variant]
    )}>
      <div className="flex justify-between items-center relative z-10 mb-6">
        <h3 className="font-medium opacity-90">{title}</h3>
        <div className={clsx("p-2.5 rounded-2xl group-hover:scale-110 transition-transform", iconStyles[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="text-5xl font-bold relative z-10 mb-1">{value}</div>
      <div className="text-sm opacity-80 font-medium relative z-10">{trend}</div>
      <div className="absolute bottom-[-30px] right-[-30px] w-32 h-32 rounded-full blur-[40px] opacity-30 z-0 bg-white"></div>
    </div>
  );
};
