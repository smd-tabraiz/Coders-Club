import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';

const Teams = () => {
  const navigate = useNavigate();

  const batches = [
    { year: '2027', nickname: 'The Rising Stars', count: 45, gradient: 'from-violet-500 to-indigo-500' },
    { year: '2026', nickname: 'The Innovators', count: 52, gradient: 'from-blue-500 to-indigo-500' },
    { year: '2025', nickname: 'The Trailblazers', count: 38, gradient: 'from-cyan-500 to-blue-500' },
    { year: '2024', nickname: 'The Pioneers', count: 41, gradient: 'from-emerald-500 to-cyan-500' },
  ];

  return (
    <div className="space-y-8 select-none">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Our Teams</h1>
        <p className="text-sm text-slate-500">Meet the batch coordinators and core pillars of Coders Club</p>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {batches.map((batch, idx) => (
          <motion.div
            key={batch.year}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            onClick={() => navigate(`/dashboard/teams/${batch.year}`)}
            className="cursor-pointer flex"
          >
            <Card className="p-0 overflow-hidden border border-slate-200/10 flex flex-col justify-between w-full min-h-[200px] hover:shadow-2xl transition-all duration-300">
              
              <div className={`p-8 bg-gradient-to-tr ${batch.gradient} text-white flex-1 flex flex-col justify-between`}>
                <div className="space-y-1">
                  <h3 className="text-4xl font-black">{batch.year}</h3>
                  <p className="text-sm font-semibold opacity-90">{batch.nickname}</p>
                </div>
                <div className="flex justify-between items-center pt-6">
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">{batch.count} Active Members</span>
                  <span className="text-xs font-bold underline">View Batch Page →</span>
                </div>
              </div>

            </Card>
          </motion.div>
        ))}
      </div>

    </div>
  );
};

export default Teams;
