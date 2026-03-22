'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Chrome, 
  Bell, 
  Award, 
  Clock, 
  Flame 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { FeedList, type VocabItem } from '@/features/dashboard/components/FeedList';
import { GoalProgress } from '@/features/dashboard/components/GoalProgress';
import { fetchVocabulary } from '@/services/supabase';

export default function DashboardPage() {
  const [vocabData, setVocabData] = useState<VocabItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchVocabulary();
        setVocabData(data || []);
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const masteredCount = vocabData.filter(item => item.learning_state === 'mastered').length;
  const reviewCount = vocabData.filter(item => item.learning_state !== 'mastered').length;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thisWeekCount = vocabData.filter(item => new Date(item.created_at) > sevenDaysAgo).length;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="greeting">
          <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight text-slate-900">Tiến bộ tuần này 🚀</h1>
          <p className="text-slate-500 text-lg font-medium">
            {loading ? 'Đang tải dữ liệu...' : `Bạn đã thu thập tổng cộng ${vocabData.length} từ vựng từ thực tế.`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden sm:flex items-center gap-2">
            <Chrome className="w-4 h-4 text-blue-500" /> Install Ext
          </Button>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Manual
          </Button>
          <Button variant="icon" className="w-11 h-11">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <StatCard 
          title="Từ đã nắm vững" 
          value={masteredCount} 
          trend={`+${thisWeekCount} tuần này`} 
          Icon={Award} 
          variant="blue" 
        />
        <StatCard 
          title="Cần ôn tập" 
          value={reviewCount} 
          trend="Tiếp tục hành trình nào!" 
          Icon={Clock} 
          variant="orange" 
        />
        <StatCard 
          title="Chuỗi ngày (Streak)" 
          value="0 Days" 
          trend="Duy trì đều đặn nhé!" 
          Icon={Flame} 
          variant="yellow" 
        />

        <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-[24px] shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Lịch sử thu thập</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Gợi ý từ vựng mới cho bạn</p>
            </div>
            <Button variant="secondary" size="sm" className="font-bold">Xem toàn bộ</Button>
          </div>
          
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 animate-pulse space-y-4">
                <div className="h-20 bg-slate-50 rounded-2xl w-full"></div>
                <div className="h-20 bg-slate-50 rounded-2xl w-full"></div>
             </div>
          ) : (
            <FeedList items={vocabData.slice(0, 10)} />
          )}
        </div>

        <GoalProgress />
      </div>
    </div>
  );
}
