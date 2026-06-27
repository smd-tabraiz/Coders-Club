import React, { useState, useEffect } from 'react';
import { HiOutlineClock, HiOutlineShieldExclamation, HiOutlineTrash, HiOutlinePencilSquare, HiOutlineDocumentPlus } from 'react-icons/hi2';
import api from '../../../../../api/axios';
import Card from '../../../../../components/ui/Card';
import Spinner from '../../../../../components/ui/Spinner';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get('/activity');
      setLogs(res.data.data);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('DELETE')) return <HiOutlineTrash className="w-5 h-5 text-rose-500" />;
    if (action.includes('UPDATE')) return <HiOutlinePencilSquare className="w-5 h-5 text-amber-500" />;
    if (action.includes('CREATE')) return <HiOutlineDocumentPlus className="w-5 h-5 text-emerald-500" />;
    return <HiOutlineShieldExclamation className="w-5 h-5 text-primary" />;
  };

  const getActionColor = (action) => {
    if (action.includes('DELETE')) return 'bg-rose-500/10 text-rose-600 dark:text-rose-400';
    if (action.includes('UPDATE')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
    if (action.includes('CREATE')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
    return 'bg-primary/10 text-primary';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
          <HiOutlineClock className="w-8 h-8 text-primary" />
          Activity Logs
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Monitor destructive and administrative actions taken by all Admins across the system.
        </p>
      </div>

      <Card className="p-0 overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
        {logs.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <HiOutlineShieldExclamation className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No activity logs found yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {logs.map((log) => (
              <div key={log._id} className="p-5 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className={`p-2.5 rounded-full shrink-0 ${getActionColor(log.action)}`}>
                  {getActionIcon(log.action)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {log.adminId?.name || 'Unknown Admin'} <span className="text-slate-400 font-normal">({log.adminId?.email})</span>
                    </p>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {log.description}
                  </p>
                  <div className="flex gap-3 mt-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      IP: {log.ipAddress || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default ActivityLogs;
