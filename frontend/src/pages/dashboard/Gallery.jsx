import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiXMark } from 'react-icons/hi2';
import api from '../../api/axios';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';

const Gallery = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, [categoryFilter]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/gallery?category=${categoryFilter === 'All' ? '' : categoryFilter}`);
      setItems(res.data.data);
    } catch (err) {
      // Mock images of varying aspect ratios
      const mockItems = [
        { _id: '1', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60', caption: 'Web Dev Boot Camp', category: 'workshops' },
        { _id: '2', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=60', caption: 'Hackathon Hackers Roster', category: 'hackathons' },
        { _id: '3', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=60', caption: 'Coding Contest Battle', category: 'competitions' },
        { _id: '4', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=60', caption: 'Member Welcome Reviews', category: 'club_activities' },
        { _id: '5', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=60', caption: 'Technical Presentation Board', category: 'workshops' },
        { _id: '6', url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&auto=format&fit=crop&q=60', caption: 'Club Team Celebration', category: 'club_activities' }
      ];

      // Filter locally for mock stubs
      const filtered = categoryFilter === 'All'
        ? mockItems
        : mockItems.filter(item => item.category === categoryFilter.toLowerCase().replace(' ', '_'));
      
      setItems(filtered);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user && (user.role === 'admin' || user.role === 'superadmin');

  return (
    <div className="space-y-8 select-none">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Pinterest Gallery</h1>
          <p className="text-sm text-slate-500">Visual logs of past workshops, hackathons, and CP competitions</p>
        </div>
      </div>

      {/* Category Tab Selector */}
      <div className="flex flex-wrap border-b border-slate-200/20 gap-6">
        {['All', 'Workshops', 'Hackathons', 'Competitions', 'Club Activities'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`pb-3 text-sm font-bold capitalize relative cursor-pointer ${
              categoryFilter === cat ? 'text-primary' : 'text-slate-500'
            }`}
          >
            {cat}
            {categoryFilter === cat && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Grid Masonry Layout */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl border border-slate-200/10">
          <p className="text-slate-500 font-medium">No media uploaded in this category yet.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => setLightboxImg(item)}
              className="break-inside-avoid relative rounded-2xl overflow-hidden cursor-pointer group shadow-lg border border-slate-200/10 transition-transform duration-300 hover:scale-[1.02]"
            >
              <img src={item.url} alt={item.caption} className="w-full h-auto object-cover" />
              {/* overlay hover details */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-6 text-white transition-opacity duration-300">
                <span className="text-[10px] uppercase font-bold text-accent tracking-wider">{item.category.replace('_', ' ')}</span>
                <h4 className="font-bold text-sm">{item.caption}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImg(null)}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm"
            />
            {/* Img wrapper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col items-center gap-4"
            >
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-0 right-0 p-2 text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <HiXMark className="w-7 h-7" />
              </button>
              <img src={lightboxImg.url} alt={lightboxImg.caption} className="max-w-full max-h-[75vh] object-contain rounded-lg" />
              <p className="text-white font-bold text-sm tracking-wide">{lightboxImg.caption}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Gallery;
