import React from 'react';
import { useData } from '../../contexts/DataContext';

export const Photos: React.FC = () => {
  const { data: YASH_DATA } = useData();
  // Using placeholder images as no real images were provided in the prompt text, 
  // but setting up the structure for a gallery.
  const images = [
    YASH_DATA.avatar,
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <div className="h-full w-full bg-black p-2 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
       {images.map((img: string, i: number) => (
           <div key={i} className="relative aspect-square group overflow-hidden rounded-md bg-gray-900">
               <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
           </div>
       ))}
       <div className="col-span-2 sm:col-span-3 text-center text-white py-10">
           <h3 className="text-xl font-bold">{YASH_DATA.name}</h3>
           <p className="text-gray-400">Portfolio Gallery</p>
       </div>
    </div>
  );
};