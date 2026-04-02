"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { galleryData as initialData, Category, GalleryItem } from './data/images';
import { 
  X, Search, Monitor, Heart, Download, ArrowUpDown, Loader2, 
  LayoutGrid, List, BarChart3, Trash2 
} from 'lucide-react';
import { toast } from 'sonner';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(initialData);
  const [activeFilter, setActiveFilter] = useState<Category>('All');
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'name'>('default');
  const [isLoading, setIsLoading] = useState(true);
  
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    
    const savedFavs = localStorage.getItem('pixel_grid_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    
    const savedOrder = localStorage.getItem('pixel_grid_order');
    if (savedOrder) setItems(JSON.parse(savedOrder));

    return () => clearTimeout(timer);
  }, []);

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFav = favorites.includes(id);
    const updated = isFav ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('pixel_grid_favs', JSON.stringify(updated));
    
    if (isFav) {
      toast.error('ASSET_DE-CLASSIFIED', { description: 'Removed from secure storage.' });
    } else {
      toast.success('ASSET_SECURED', { description: 'Added to your private archive.' });
    }
  };

  const handleReorder = (newOrder: GalleryItem[]) => {
    setItems(newOrder);
    localStorage.setItem('pixel_grid_order', JSON.stringify(newOrder));
  };

  const filteredAndSorted = useMemo(() => {
    let result = items.filter(item => {
      const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
    if (sortBy === 'name') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [items, activeFilter, search, sortBy]);

  const stats = useMemo(() => {
    const total = items.length;
    const catCounts = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return { total, catCounts };
  }, [items]);

  return (
    <main className="min-h-screen p-4 md:p-12 font-mono selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-8 p-8 bg-zinc-900/20 border border-white/5 rounded-[2.5rem] backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <Monitor className="text-emerald-500" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black italic uppercase tracking-tighter">Pixel_Grid<span className="text-emerald-500">.v4</span></h1>
              <p className="text-[9px] text-zinc-500 tracking-[4px] uppercase font-bold">Node: D-7_ARCHIVE // Status: Online</p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH_BY_ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-900/40 border border-white/5 py-3 pl-12 pr-4 rounded-xl outline-none focus:border-emerald-500/30 transition-all text-[10px] uppercase tracking-widest"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center mb-8 gap-4 px-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowStats(!showStats)}
              className={`p-3 rounded-xl border transition-all ${showStats ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-zinc-900/40 border-white/5 text-zinc-500 hover:text-white'}`}
            >
              <BarChart3 size={18} />
            </button>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex bg-zinc-900/40 p-1 rounded-xl border border-white/5">
              <button 
                onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-zinc-800 text-emerald-500' : 'text-zinc-600 hover:text-white'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-zinc-800 text-emerald-500' : 'text-zinc-600 hover:text-white'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['All', 'Auto', 'Music', 'Tech'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[2px] transition-all border ${
                  activeFilter === cat 
                  ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                  : 'text-zinc-500 border-white/5 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
            <button 
              onClick={() => setSortBy(sortBy === 'default' ? 'name' : 'default')}
              className="px-4 py-2 bg-zinc-900/40 border border-white/5 rounded-xl hover:bg-white/5 transition-all text-[9px] font-bold uppercase tracking-widest flex items-center gap-2"
            >
              <ArrowUpDown size={12} className={sortBy !== 'default' ? "text-emerald-500" : "text-zinc-500"} /> {sortBy}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showStats && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8 bg-zinc-900/20 border border-white/5 rounded-3xl backdrop-blur-sm"
            >
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Total_Assets</p>
                  <p className="text-4xl font-black text-emerald-500">{stats.total}</p>
                </div>
                {Object.entries(stats.catCounts).map(([cat, count]) => (
                  <div key={cat} className="space-y-2">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{cat}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / stats.total) * 100}%` }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                      <span className="text-sm font-bold text-zinc-300">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-[2.5rem] bg-zinc-900/40 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <Reorder.Group 
            axis="y" 
            values={filteredAndSorted} 
            onReorder={handleReorder}
            className={view === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "flex flex-col gap-4"
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSorted.map((item) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  initial={{ opacity: 0, scale: view === 'grid' ? 0.9 : 1, y: view === 'list' ? 20 : 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group relative cursor-grab active:cursor-grabbing ${
                    view === 'list' ? 'bg-zinc-900/30 border border-white/5 rounded-2xl p-4 flex items-center gap-6 hover:bg-zinc-900/60 transition-colors' : ''
                  }`}
                >
                  {view === 'grid' ? (
                    <div 
                      onClick={() => setSelectedImage(item)}
                      className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 relative shadow-2xl"
                    >
                      <img 
                        src={item.url} 
                        alt={item.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent p-8 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="flex justify-end">
                          <button 
                            onClick={(e) => toggleFavorite(item.id, e)}
                            className={`p-3 rounded-full border border-white/10 transition-all ${
                              favorites.includes(item.id) ? 'bg-red-500 border-red-500' : 'bg-white/5 hover:bg-white/20'
                            }`}
                          >
                            <Heart size={16} fill={favorites.includes(item.id) ? "currentColor" : "none"} />
                          </button>
                        </div>
                        <div>
                          <p className="text-emerald-500 text-[9px] font-black tracking-[4px] uppercase mb-2">{item.category}</p>
                          <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none">{item.title}</h3>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 cursor-pointer"
                        onClick={() => setSelectedImage(item)}
                      >
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover pointer-events-none" />
                      </div>
                      <div className="flex-1 min-w-0" onClick={() => setSelectedImage(item)}>
                        <h3 className="font-black italic uppercase tracking-wider truncate">{item.title}</h3>
                        <p className="text-[9px] text-emerald-500 tracking-[3px] uppercase mt-1">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 pr-2">
                          <button 
                            onClick={(e) => toggleFavorite(item.id, e)}
                            className={`p-2 sm:p-3 rounded-full border transition-all ${
                              favorites.includes(item.id) ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'border-transparent text-zinc-500 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            <Heart size={16} fill={favorites.includes(item.id) ? "currentColor" : "none"} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); toast.success('DOWNLOAD_STARTED', { description: 'Asset is being piped to your system.' }); }}
                            className="p-2 sm:p-3 rounded-full border border-transparent text-zinc-500 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"
                          >
                            <Download size={16} />
                          </button>
                      </div>
                    </>
                  )}
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}

        {!isLoading && filteredAndSorted.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-40 text-center">
            <Loader2 className="mx-auto mb-4 text-emerald-500 animate-spin" size={32} />
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Search returned zero results... Check parameters.</p>
          </motion.div>
        )}

      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full max-h-[80vh] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(16,185,129,0.1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImage.url} className="w-full h-full object-contain bg-black/50" />
              <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                  <span className="text-emerald-500 text-[10px] font-black tracking-[6px] uppercase mb-4 block underline decoration-2 underline-offset-8">Category: {selectedImage.category}</span>
                  <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">{selectedImage.title}</h2>
                </div>
                <button 
                  onClick={() => toast.success('DOWNLOAD_STARTED', { description: 'Asset is being piped to your system.' })}
                  className="flex items-center gap-4 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all active:scale-95"
                >
                  <Download size={18} /> Get_Asset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}