export type Category = 'Auto' | 'Music' | 'Tech' | 'All';

export interface GalleryItem {
  id: number;
  title: string;
  category: Exclude<Category, 'All'>;
  url: string;
}

export const galleryData: GalleryItem[] = [
  { id: 1, title: "E30_DRIFT_PROJECT", category: 'Auto', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537' },
  { id: 2, title: "GLITCH_VIBES_STUDIO", category: 'Music', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04' },
  { id: 3, title: "NEON_HARDWARE", category: 'Tech', url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f' },
  { id: 4, title: "M10_ENGINE_DETAIL", category: 'Auto', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70' },
  { id: 5, title: "ANALOG_SYNTH", category: 'Music', url: 'https://images.unsplash.com/photo-1514333519803-f368f5431662' },
  { id: 6, title: "CYBER_SERVER_RACK", category: 'Tech', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab' },
];