'use client';

import React from 'react';
import { INITIAL_BANNERS } from '@/lib/mockData';
import { Sparkles, Tag, Truck } from 'lucide-react';

interface AnnouncementMarqueeProps {
  banners?: typeof INITIAL_BANNERS;
}

export const AnnouncementMarquee: React.FC<AnnouncementMarqueeProps> = ({
  banners = INITIAL_BANNERS,
}) => {
  const activeBanners = banners.filter((b) => b.is_active);

  if (activeBanners.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white shadow-md overflow-hidden py-3 font-medium text-sm md:text-base border-b border-emerald-500/30">
      <div className="flex w-max animate-marquee space-x-8 items-center whitespace-nowrap">
        {/* Double the list to ensure seamless infinite looping marquee scroll */}
        {[...activeBanners, ...activeBanners, ...activeBanners].map((banner, index) => (
          <div
            key={`${banner.id}-${index}`}
            className="flex items-center space-x-3 px-4 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15 shadow-sm"
          >
            {index % 3 === 0 ? (
              <Tag className="w-4 h-4 text-amber-300 animate-pulse" />
            ) : index % 3 === 1 ? (
              <Truck className="w-4 h-4 text-emerald-200" />
            ) : (
              <Sparkles className="w-4 h-4 text-yellow-300" />
            )}
            <span className="tracking-wide text-white drop-shadow-sm">
              {banner.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
