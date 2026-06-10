import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { HiTrophy, HiMagnifyingGlass } from 'react-icons/hi2';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const mockLeaderboard = [
  { rank: 1, name: 'Anish Reddy', dept: 'CSE', events: 18, wins: 7, score: 980 },
  { rank: 2, name: 'Sai Kiran', dept: 'IT', events: 15, wins: 5, score: 870 },
  { rank: 3, name: 'Venkatesh P', dept: 'CSE', events: 14, wins: 4, score: 820 },
  { rank: 4, name: 'Harika K', dept: 'ECE', events: 12, wins: 3, score: 760 },
  { rank: 5, name: 'Ravi Teja', dept: 'CSE', events: 11, wins: 3, score: 720 },
  { rank: 6, name: 'Divya S', dept: 'IT', events: 10, wins: 2, score: 680 },
  { rank: 7, name: 'Karthik M', dept: 'EEE', events: 9, wins: 2, score: 640 },
  { rank: 8, name: 'Priya N', dept: 'CSE', events: 9, wins: 1, score: 600 },
  { rank: 9, name: 'Arun K', dept: 'MECH', events: 8, wins: 1, score: 560 },
  { rank: 10, name: 'Sneha R', dept: 'IT', events: 8, wins: 1, score: 540 },
];

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

  const filtered = mockLeaderboard.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.dept.toLowerCase().includes(search.toLowerCase())
  );

  const top3 = mockLeaderboard.slice(0, 3);

  return (
    <div className="space-y-10 select-none">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
            <HiTrophy className="text-amber-400" /> Leaderboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">Top performers ranked by event participation & wins</p>
        </div>
      </div>

      {/* Podium Top 3 */}
      <Card className="flex flex-col items-center py-10 border border-slate-200/10 bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8">Hall of Fame</h3>
        <div className="flex items-end justify-center gap-6 w-full max-w-md">
          {/* Silver — 2nd */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-3"
          >
            <Avatar name={top3[1].name} size="md" />
            <p className="text-xs font-bold text-center leading-tight">{top3[1].name}</p>
            <p className="text-[10px] text-slate-400">{top3[1].score} pts</p>
            <div className={`w-20 ${podiumHeights[1]} rounded-t-xl bg-gradient-to-t ${podiumColors[1]} flex items-start justify-center pt-2`}>
              <span className="text-2xl">{medalEmoji[1]}</span>
            </div>
          </motion.div>

          {/* Gold — 1st (center, tallest) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <Avatar name={top3[0].name} size="lg" className="ring-4 ring-amber-400/60 shadow-xl shadow-amber-400/20" />
            <p className="text-sm font-extrabold text-center leading-tight">{top3[0].name}</p>
            <p className="text-[10px] text-slate-300">{top3[0].score} pts</p>
            <div className={`w-24 ${podiumHeights[0]} rounded-t-xl bg-gradient-to-t ${podiumColors[0]} flex items-start justify-center pt-2`}>
              <span className="text-3xl">{medalEmoji[0]}</span>
            </div>
          </motion.div>

          {/* Bronze — 3rd */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            <Avatar name={top3[2].name} size="md" />
            <p className="text-xs font-bold text-center leading-tight">{top3[2].name}</p>
            <p className="text-[10px] text-slate-400">{top3[2].score} pts</p>
            <div className={`w-20 ${podiumHeights[2]} rounded-t-xl bg-gradient-to-t ${podiumColors[2]} flex items-start justify-center pt-2`}>
              <span className="text-2xl">{medalEmoji[2]}</span>
            </div>
          </motion.div>
        </div>
      </Card>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <input
          type="text"
          placeholder="Search member or department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
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
              {filtered.map((member, idx) => {
                const isCurrentUser = user?.name === member.name;
                return (
                  <motion.tr
                    key={member.rank}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-primary/5 dark:bg-primary/10'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'
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
      </Card>
    </div>
  );
};

export default Leaderboard;
