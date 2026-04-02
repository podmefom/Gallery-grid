"use client";

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryData, Category, GalleryItem } from './data/images';
import { X, Search, Activity, Cpu, HardDrive, Heart, Download, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('All');
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'name'>('default');

  // Загрузка избранного при старте
  useEffect(() => {
    const saved = localStorage.getItem('pixel_grid_favs');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Сохранение избранного
  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = favorites.includes(id) 
      ? favorites.filter(favId => favId !== id) 
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('pixel_grid_favs', JSON.stringify(updated));
  };

  // Логика фильтрации и сортировки (useMemo для оптимизации)
  const filteredAndSorted = useMemo(() => {
    let result = galleryData.filter(item => {
      const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }
    return result;
  }, [activeFilter, search, sortBy]);

  // Хоткеи для лайтбокса
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const handleDownload = async (url: string, title: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.jpg`;
    link.click();
  };

  return (
    <main className="min-h-screen p-4 md:p-12 bg-[#050505] text-white font-mono selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* SYSTEM STATUS BAR */}
        <div className="flex flex-wrap gap-6 mb-12 p-6 bg-zinc-900/20 border border-white/5 rounded-3xl backdrop-blur-md justify-between items-center">
            <div className="flex gap-8">
                <div className="flex items-center gap-3">
                    <Activity size={14} className="text-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-zinc-500 uppercase tracking-[3px]">Uplink: <span className="text-white">Secure</span></span>
                </div>
                <div className="flex items-center gap-3">
                    <Heart size={14} className={favorites.length > 0 ? "text-red-500" : "text-zinc-600"} />
                    <span className="text-[9px] text-zinc-500 uppercase tracking-[3px]">Favorites: <span className="text-white">{favorites.length}</span></span>
                </div>
            </div>
            <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent mx-10" />
            <h1 className="text-lg font-black italic uppercase tracking-tighter opacity-50">Pixel_Grid_v4.0.2</h1>
        </div>

        {/* CONTROLS AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-10">
          {/* SEARCH */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              type="text" 
              placeholder="ENTRY_ID_SEARCH..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/40 border border-white/5 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-emerald-500/30 transition-all text-xs uppercase tracking-widest"
            />
          </div>

          {/* FILTERS */}
          <div className="lg:col-span-6 flex flex-wrap gap-2 justify-center lg:justify-start">
            {(['All', 'Auto', 'Music', 'Tech'] as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-[2px] transition-all border ${
                  activeFilter === cat 
                  ? 'bg-emerald-500 border-emerald-500 text-black' 
                  : 'text-zinc-500 border-white/5 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SORT */}
          <div className="lg:col-span-2">
            <button 
                onClick={() => setSortBy(sortBy === 'default' ? 'name' : 'default')}
                className="w-full h-full flex items-center justify-center gap-3 bg-zinc-900/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-all"
            >
                <ArrowUpDown size={16} className="text-emerald-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Sort: {sortBy}</span>
            </button>
          </div>
        </div>

        {/* MASONRY-LIKE GRID */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredAndSorted.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => setSelectedImage(item)}
                className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer"
              >
                <img 
                  src={item.url} 
                  alt={item.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                
                {/* Overlay UI */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <button 
                        onClick={(e) => toggleFavorite(item.id, e)}
                        className={`p-3 rounded-full backdrop-blur-md border border-white/10 transition-all ${
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
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl"
            >
              <div className="absolute top-10 left-10 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] tracking-[5px] uppercase font-bold text-zinc-500">Inspecting_Node: {selectedImage.id}</span>
              </div>

              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="relative max-w-6xl w-full max-h-[85vh] rounded-[2.5rem] overflow-hidden border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={selectedImage.url} className="w-full h-full object-contain bg-zinc-900/50" />
                <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black via-black/60 to-transparent flex justify-between items-end">
                  <div>
                    <span className="text-emerald-500 text-[10px] font-black tracking-[6px] uppercase mb-4 block underline decoration-2 underline-offset-8">Category: {selectedImage.category}</span>
                    <h2 className="text-5xl font-black italic uppercase tracking-tighter">{selectedImage.title}</h2>
                  </div>
                  <button 
                    onClick={() => handleDownload(selectedImage.url, selectedImage.title)}
                    className="group flex items-center gap-4 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-all active:scale-95"
                  >
                    <Download size={18} /> Download_Asset
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}