'use client';

import React from 'react';
import { Quote, Link as LinkIcon } from 'lucide-react';

export interface VocabItem {
  id: string;
  target_word: string;
  translation: string;
  part_of_speech?: string;
  context_sentence?: string;
  source_url?: string;
  learning_state: 'new' | 'reviewed' | 'mastered';
  created_at: string;
}

interface FeedListProps {
  items: VocabItem[];
}

export const FeedList = ({ items }: FeedListProps) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <BookOpenIcon className="w-8 h-8 opacity-20" />
        </div>
        <p className="font-medium text-lg text-slate-800">Chưa có dữ liệu thu thập.</p>
        <p className="text-sm opacity-70">Bắt đầu đọc và lưu từ vựng ngay!</p>
      </div>
    );
  }

  const formatContext = (sentence: string, target: string) => {
    if (!sentence) return '';
    try {
      const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escapedTarget})`, 'gi');
      return sentence.split(regex).map((part, i) => 
        part.toLowerCase() === target.toLowerCase() 
          ? <strong key={i} className="text-slate-900 font-bold bg-yellow-400/20 px-1 rounded shadow-sm ring-1 ring-yellow-400/20">{part}</strong>
          : part
      );
    } catch (e) {
      return sentence;
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        let badgeStyle = '';
        let badgeText = '';
        if (item.learning_state === 'new') {
          badgeStyle = 'bg-blue-50 text-blue-600 border-blue-100';
          badgeText = 'Mới';
        } else if (item.learning_state === 'mastered') {
          badgeStyle = 'bg-green-50 text-green-600 border-green-100';
          badgeText = 'Đã thuộc';
        } else {
          badgeStyle = 'bg-amber-50 text-amber-600 border-amber-100';
          badgeText = 'Đang học';
        }

        let domain = 'Nguồn chưa xác định';
        try { if(item.source_url) domain = new URL(item.source_url).hostname.replace('www.', ''); } catch(e) {}

        return (
          <div key={item.id} className="group p-5 bg-white rounded-[24px] border border-slate-100 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-slate-900 group-hover:text-blue-500 transition-colors leading-none tracking-tight">{item.target_word}</span>
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 rounded-full">{item.part_of_speech || 'word'}</span>
              </div>
              <span className={`px-4 py-1.5 text-[11px] font-bold rounded-full border shadow-sm ${badgeStyle}`}>{badgeText}</span>
            </div>
            
            <div className="text-[18px] font-bold text-blue-500 mb-5 leading-snug">{item.translation}</div>
            
            <div className="bg-slate-50 rounded-2xl p-4 mb-5 border border-slate-100 flex gap-3 group/context transition-colors hover:bg-slate-100/50">
              <Quote className="w-5 h-5 text-slate-300 flex-shrink-0 mt-1" />
              <span className="text-sm italic text-slate-500 leading-relaxed font-medium">
                {formatContext(item.context_sentence || '', item.target_word)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
              <LinkIcon className="w-3.5 h-3.5 opacity-50" />
              <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 hover:underline transition-all truncate max-w-[200px]">{domain}</a>
            </div>
            
            <div className="absolute -right-2 -bottom-2 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-[0.05] transition-opacity rounded-full blur-xl"></div>
          </div>
        );
      })}
    </div>
  );
};

const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
);
