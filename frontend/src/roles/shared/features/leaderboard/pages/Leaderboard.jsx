import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { motion } from 'framer-motion';
import { HiTrophy, HiMagnifyingGlass, HiOutlineDocumentText } from 'react-icons/hi2';
import Avatar from '../../../../../components/ui/Avatar';
import Card from '../../../../../components/ui/Card';
import Badge from '../../../../../components/ui/Badge';
import { getAllEvents } from '../../../../../features/events/event.service';

const podiumColors = [
  'from-yellow-400 to-amber-500',
  'from-slate-300 to-slate-400',
  'from-amber-600 to-orange-500',
];
const podiumHeights = ['h-32', 'h-24', 'h-20'];
const medalEmoji = ['🥇', '🥈', '🥉'];

const Leaderboard = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getAllEvents();
        const completedEvents = res.data.data.filter(e => e.status === 'completed' && e.results && e.results.length > 0);
        setEvents(completedEvents);
        if (completedEvents.length > 0) {
          setSelectedEventId(completedEvents[0]._id);
        }
      } catch (error) {
        console.error('Failed to fetch events for leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const selectedEvent = events.find(e => e._id === selectedEventId);
  const rawResults = selectedEvent ? selectedEvent.results.sort((a, b) => a.rank - b.rank) : [];

  const filtered = rawResults.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.dept?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginatedResults = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const top3 = rawResults.slice(0, 3);

  return (
    <div className="space-y-10 select-none">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
            <HiTrophy className="text-amber-400" /> Leaderboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">View contest results and top performers</p>
        </div>
        {events.length > 0 && (
          <select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm font-bold shadow-sm"
          >
            {events.map(ev => (
              <option key={ev._id} value={ev._id}>{ev.name}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 font-bold">Loading results...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <HiOutlineDocumentText className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold mb-2">No Results Available</h3>
          <p>Results for past contests have not been uploaded yet.</p>
        </div>
      ) : (
        <>
          {/* Podium Top 3 */}
          {top3.length >= 3 && (
      <div className="relative flex flex-col items-center py-12 px-4 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white border border-white/10">
        {/* Background glow effects */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-fuchsia-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full" />
        
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/50 mb-10 relative z-10 flex items-center gap-2">
          <HiTrophy className="w-4 h-4" /> Hall of Fame
        </h3>
        
        <div className="relative z-10 flex items-end justify-center gap-4 sm:gap-8 w-full max-w-xl">
          {/* Silver — 2nd */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            className="flex flex-col items-center gap-3 w-1/3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-slate-300 rounded-full blur-md opacity-50"></div>
              <Avatar name={top3[1].name} size="md" className="relative ring-4 ring-slate-300/80 shadow-lg" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-center leading-tight truncate w-full">{top3[1].name}</p>
            <p className="text-[10px] sm:text-xs text-white/60 font-semibold bg-white/10 px-2 py-0.5 rounded-full">{top3[1].score} pts</p>
            <div className={`w-full max-w-[80px] ${podiumHeights[1]} rounded-t-xl bg-gradient-to-t from-slate-400 to-slate-200 flex items-start justify-center pt-3 shadow-[0_0_30px_rgba(203,213,225,0.2)] border border-slate-300/30 border-b-0`}>
              <span className="text-3xl drop-shadow-md">{medalEmoji[1]}</span>
            </div>
          </motion.div>

          {/* Gold — 1st (center, tallest) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="flex flex-col items-center gap-3 w-1/3 relative z-20"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full blur-xl opacity-60 animate-pulse"></div>
              <Avatar name={top3[0].name} size="lg" className="relative ring-4 ring-yellow-400 shadow-2xl shadow-yellow-500/50" />
            </div>
            <p className="text-sm sm:text-base font-black text-center leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 truncate w-full">{top3[0].name}</p>
            <p className="text-xs font-bold text-yellow-900 bg-yellow-400 px-3 py-1 rounded-full shadow-lg shadow-yellow-500/20">{top3[0].score} pts</p>
            <div className={`w-full max-w-[100px] ${podiumHeights[0]} rounded-t-2xl bg-gradient-to-t from-amber-600 via-yellow-500 to-yellow-300 flex items-start justify-center pt-4 shadow-[0_0_50px_rgba(234,179,8,0.4)] border border-yellow-300/50 border-b-0 relative`}>
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl" />
              <span className="text-4xl drop-shadow-xl relative z-10">{medalEmoji[0]}</span>
            </div>
          </motion.div>

          {/* Bronze — 3rd */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="flex flex-col items-center gap-3 w-1/3"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400 rounded-full blur-md opacity-40"></div>
              <Avatar name={top3[2].name} size="md" className="relative ring-4 ring-orange-400/80 shadow-lg" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-center leading-tight truncate w-full">{top3[2].name}</p>
            <p className="text-[10px] sm:text-xs text-white/60 font-semibold bg-white/10 px-2 py-0.5 rounded-full">{top3[2].score} pts</p>
            <div className={`w-full max-w-[80px] ${podiumHeights[2]} rounded-t-xl bg-gradient-to-t from-orange-600 to-orange-400 flex items-start justify-center pt-3 shadow-[0_0_30px_rgba(249,115,22,0.2)] border border-orange-300/30 border-b-0`}>
              <span className="text-3xl drop-shadow-md">{medalEmoji[2]}</span>
            </div>
          </motion.div>
        </div>
      </div>
      )}

      {/* Search bar */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search member or department..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full py-2.5 pl-11 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
        />
        <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      </div>

      {/* Full Rankings Table */}
      <Card className="p-0 overflow-hidden border border-slate-200/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/10 bg-slate-50 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-400 tracking-wider w-16">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-400 tracking-wider">Member</th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-400 tracking-wider hidden md:table-cell">Dept</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase text-slate-400 tracking-wider hidden sm:table-cell">Events</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase text-slate-400 tracking-wider hidden sm:table-cell">Wins</th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase text-slate-400 tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/10">
              {paginatedResults.map((member, idx) => {
                const isCurrentUser = user?.name === member.name;
                return (
                  <motion.tr
                    key={member.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`transition-all duration-300 relative ${
                      isCurrentUser
                        ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary'
                        : 'hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:scale-[1.01] hover:z-10'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <span className={`font-extrabold text-base ${
                        member.rank === 1 ? 'text-amber-400' :
                        member.rank === 2 ? 'text-slate-400' :
                        member.rank === 3 ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        {member.rank <= 3 ? medalEmoji[member.rank - 1] : `#${member.rank}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={member.name} size="sm" />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white leading-tight">
                            {member.name}
                            {isCurrentUser && <span className="ml-2 text-[10px] text-primary font-bold">(You)</span>}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Badge variant="secondary">{member.dept}</Badge>
                    </td>
                    <td className="px-6 py-4 text-center hidden sm:table-cell">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{member.events}</span>
                    </td>
                    <td className="px-6 py-4 text-center hidden sm:table-cell">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">{member.wins}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-extrabold text-primary dark:text-primary-400">{member.score}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/10">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm font-semibold text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </Card>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
