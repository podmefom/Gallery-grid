"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryData, Category, GalleryItem } from './data/images';
import { X, Search, Activity, Cpu, HardDrive } from 'lucide-react';

const categories: Category[] = ['All', 'Auto', 'Music', 'Tech'];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<Category>('All');
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filtered = galleryData.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen p-4 md:p-12 bg-[#050505] text-white font-mono">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-wrap gap-6 mb-12 p-6 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-sm justify-between items-center">
            <div className="flex gap-8">
                <div className="flex items-center gap-3">
                    <Activity size={16} className="text-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Uplink: <span className="text-white">Active</span></span>
                </div>
                <div className="flex items-center gap-3">
                    <HardDrive size={16} className="text-emerald-500" />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Storage: <span className="text-white">{galleryData.length} Files</span></span>
                </div>
                <div className="flex items-center gap-3">
                    <Cpu size={16} className="text-emerald-500" />
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Load: <span className="text-white">2.4%</span></span>
                </div>
            </div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter hidden md:block">Pixel_Grid.v4</h1>
        </div>


        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
          

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH_ARCHIVE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 py-4 pl-12 pr-4 rounded-2xl outline-none focus:border-emerald-500/50 transition-all text-sm uppercase tracking-widest placeholder:text-zinc-700"
            />
          </div>


          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === cat 
                  ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                  : 'text-zinc-500 border border-white/5 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>


        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setSelectedImage(item)}
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 cursor-pointer shadow-2xl"
              >
                <img 
                  src={item.url} 
                  alt={item.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <p className="text-emerald-500 text-[10px] font-bold tracking-[3px] uppercase mb-2">{item.category}</p>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl cursor-zoom-out"
            >
              <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                <X size={32} />
              </button>
              
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="relative max-w-5xl w-full aspect-video rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)] border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black via-black/40 to-transparent">
                  <span className="text-emerald-500 text-xs font-bold tracking-[5px] uppercase mb-4 block">{selectedImage.category}</span>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter">{selectedImage.title}</h2>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}