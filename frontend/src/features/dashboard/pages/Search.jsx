import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { HiMagnifyingGlass, HiOutlineCalendar, HiOutlineUser } from 'react-icons/hi2';
import Card from '../../../components/ui/Card';
import Avatar from '../../../components/ui/Avatar';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState({ events: [], members: [] });

  useEffect(() => {
    // Search mock filter logic based on the query parameter
    const mockEvents = [
      { id: '1', name: 'Code Sprint 2026', type: 'competition', date: 'Oct 15, 2026' },
      { id: '2', name: 'React Web Bootcamp', type: 'workshop', date: 'Nov 05, 2026' }
    ];
    const mockMembers = [
      { id: '1', name: 'Anish Reddy', rollNo: '22911A0501', department: 'CSE' },
      { id: '2', name: 'Sai Kiran', rollNo: '22911A0502', department: 'IT' }
    ];

    const filteredEvents = mockEvents.filter(e => e.name.toLowerCase().includes(query.toLowerCase()));
    const filteredMembers = mockMembers.filter(m => m.name.toLowerCase().includes(query.toLowerCase()) || m.rollNo.includes(query));

    setResults({ events: filteredEvents, members: filteredMembers });
  }, [query]);

  return (
    <div className="space-y-8 select-none max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Search Results</h1>
        <p className="text-sm text-slate-500">Query matches for "{query}" across the database</p>
      </div>

      {results.events.length === 0 && results.members.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-slate-200/10">
          <p className="text-slate-500 font-medium">No matches found for your search query.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Events Matches */}
          {results.events.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">Matched Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.events.map(evt => (
                  <Link key={evt.id} to={`/dashboard/events/${evt.id}`} className="block">
                    <Card className="flex items-center gap-4 hover:shadow-lg hover:border-primary/20 transition-all border border-slate-200/10">
                      <div className="p-3 bg-primary/10 text-primary text-xl rounded-xl">
                        <HiOutlineCalendar />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white">{evt.name}</h4>
                        <p className="text-xs text-slate-500 capitalize">{evt.type} • {evt.date}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Members Matches */}
          {results.members.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-lg">Matched Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.members.map(mem => (
                  <Card key={mem.id} className="flex items-center gap-4 border border-slate-200/10">
                    <Avatar name={mem.name} size="sm" />
                    <div className="text-left">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white">{mem.name}</h4>
                      <p className="text-xs text-slate-500 uppercase">{mem.rollNo} • {mem.department}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default Search;
