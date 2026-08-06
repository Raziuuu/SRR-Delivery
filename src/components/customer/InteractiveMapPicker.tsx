'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Search, Loader2, Plus, Minus } from 'lucide-react';

interface InteractiveMapPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelected: (data: {
    address: string;
    city: string;
    pincode: string;
    lat: number;
    lng: number;
  }) => void;
}

export const InteractiveMapPicker: React.FC<InteractiveMapPickerProps> = ({
  initialLat = 12.86356450672943,
  initialLng = 75.05230341291362,
  onLocationSelected,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('Fetching pinned location address...');
  const [currentCity, setCurrentCity] = useState('');
  const [currentPincode, setCurrentPincode] = useState('');
  const [currentLat, setCurrentLat] = useState(initialLat);
  const [currentLng, setCurrentLng] = useState(initialLng);

  // Reverse geocode via server-side route
  const resolveAddressForCoords = async (latitude: number, longitude: number) => {
    setIsGeocoding(true);
    setCurrentLat(latitude);
    setCurrentLng(longitude);

    try {
      const res = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`);
      const data = await res.json();

      if (data.formatted_address) {
        setCurrentAddress(data.formatted_address);
        setCurrentCity(data.city || 'Local Area');
        setCurrentPincode(data.pincode || '');
        onLocationSelected({
          address: data.formatted_address,
          city: data.city || 'Local Area',
          pincode: data.pincode || '',
          lat: latitude,
          lng: longitude,
        });
      }
    } catch (err) {
      console.error('Map geocode error', err);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Helper to auto-center map on user's real-time device GPS location
  const autoDetectDeviceLocation = (mapInstance: any) => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          if (mapInstance) {
            if ((window as any).google && mapInstance.panTo) {
              mapInstance.panTo({ lat: userLat, lng: userLng });
              mapInstance.setZoom(16);
            } else if ((window as any).L && mapInstance.setView) {
              mapInstance.setView([userLat, userLng], 16);
            }
          }
          resolveAddressForCoords(userLat, userLng);
        },
        () => {
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  };

  // Initialize Map SDK (Google Maps if Key exists, or Leaflet OpenStreetMap fallback)
  useEffect(() => {
    let isMounted = true;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your-google-maps')) {
      if (typeof window !== 'undefined' && !(window as any).google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (!isMounted) return;
          initGoogleMap(initialLat, initialLng);
        };
        document.head.appendChild(script);
      } else if ((window as any).google) {
        initGoogleMap(initialLat, initialLng);
      }
    } else {
      if (typeof window !== 'undefined') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => {
          if (!isMounted) return;
          initLeafletMap(initialLat, initialLng);
        };
        document.head.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Google Maps Initialization
  const initGoogleMap = (lat: number, lng: number) => {
    if (!mapContainerRef.current || !(window as any).google) return;
    const google = (window as any).google;

    const map = new google.maps.Map(mapContainerRef.current, {
      center: { lat, lng },
      zoom: 16,
      disableDefaultUI: false,
      zoomControl: true,
      scrollwheel: true,
      gestureHandling: 'greedy',
    });

    mapInstanceRef.current = map;
    resolveAddressForCoords(lat, lng);
    autoDetectDeviceLocation(map);

    map.addListener('idle', () => {
      const center = map.getCenter();
      const newLat = center.lat();
      const newLng = center.lng();
      resolveAddressForCoords(newLat, newLng);
    });
  };

  // Leaflet Map Initialization
  const initLeafletMap = (lat: number, lng: number) => {
    if (!mapContainerRef.current || !(window as any).L) return;
    const L = (window as any).L;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map);

    mapInstanceRef.current = map;
    resolveAddressForCoords(lat, lng);
    autoDetectDeviceLocation(map);

    map.on('moveend', () => {
      const center = map.getCenter();
      resolveAddressForCoords(center.lat, center.lng);
    });
  };

  // Zoom Control Handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      if ((window as any).google && mapInstanceRef.current.getZoom) {
        const currentZoom = mapInstanceRef.current.getZoom();
        mapInstanceRef.current.setZoom(currentZoom + 1);
      } else if ((window as any).L && mapInstanceRef.current.zoomIn) {
        mapInstanceRef.current.zoomIn();
      }
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      if ((window as any).google && mapInstanceRef.current.getZoom) {
        const currentZoom = mapInstanceRef.current.getZoom();
        mapInstanceRef.current.setZoom(Math.max(1, currentZoom - 1));
      } else if ((window as any).L && mapInstanceRef.current.zoomOut) {
        mapInstanceRef.current.zoomOut();
      }
    }
  };

  // Move Map Pin to User's Current GPS Location
  const handleLocateMe = () => {
    if (mapInstanceRef.current) {
      autoDetectDeviceLocation(mapInstanceRef.current);
    }
  };

  // Search landmark / area
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsGeocoding(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your-google-maps')) {
        const googleRes = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${apiKey}`
        );
        const googleData = await googleRes.json();
        if (googleData.results && googleData.results.length > 0) {
          const top = googleData.results[0];
          const location = top.geometry.location;
          const newLat = location.lat;
          const newLng = location.lng;

          if (mapInstanceRef.current) {
            if ((window as any).google && mapInstanceRef.current.panTo) {
              mapInstanceRef.current.panTo({ lat: newLat, lng: newLng });
              mapInstanceRef.current.setZoom(16);
            } else if ((window as any).L && mapInstanceRef.current.setView) {
              mapInstanceRef.current.setView([newLat, newLng], 16);
            }
          }
          resolveAddressForCoords(newLat, newLng);
          setIsGeocoding(false);
          return;
        }
      }

      // OSM search fallback
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const results = await res.json();
      if (results && results.length > 0) {
        const top = results[0];
        const newLat = parseFloat(top.lat);
        const newLng = parseFloat(top.lon);

        if (mapInstanceRef.current) {
          if ((window as any).google && mapInstanceRef.current.panTo) {
            mapInstanceRef.current.panTo({ lat: newLat, lng: newLng });
            mapInstanceRef.current.setZoom(16);
          } else if ((window as any).L && mapInstanceRef.current.setView) {
            mapInstanceRef.current.setView([newLat, newLng], 16);
          }
        }
        resolveAddressForCoords(newLat, newLng);
      }
    } catch (err) {
      console.error('Search location error', err);
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search colony, area, landmark (e.g. Uppinangady, BC Road, Melkar)..."
          className="w-full pl-10 pr-24 py-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 bottom-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
        >
          Search
        </button>
      </form>

      {/* Interactive Map Container */}
      <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-inner border border-neutral-200 bg-neutral-100">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Centered Draggable Location Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-20 flex flex-col items-center">
          <div className="bg-neutral-900 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg mb-1 whitespace-nowrap animate-bounce flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Order Deliver Here</span>
          </div>
          <MapPin className="w-10 h-10 text-emerald-600 drop-shadow-xl fill-emerald-100" />
          <div className="w-3 h-1.5 bg-black/30 rounded-full blur-[2px] mt-[-4px]" />
        </div>

        {/* Custom Zoom Controls (+ / -) */}
        <div className="absolute top-4 right-4 z-30 flex flex-col space-y-1">
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-9 h-9 bg-white hover:bg-neutral-50 text-neutral-800 rounded-xl shadow-lg border border-neutral-200 flex items-center justify-center font-bold text-lg active:scale-95 transition-all"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-9 h-9 bg-white hover:bg-neutral-50 text-neutral-800 rounded-xl shadow-lg border border-neutral-200 flex items-center justify-center font-bold text-lg active:scale-95 transition-all"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Floating "Locate Me" Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="absolute bottom-4 right-4 z-30 p-3 bg-white hover:bg-emerald-50 text-emerald-700 rounded-2xl shadow-xl border border-neutral-200 flex items-center space-x-2 text-xs font-black transition-all active:scale-95"
        >
          <Navigation className={`w-4 h-4 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
        </button>
      </div>

      {/* Real-time Address Card */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start space-x-3">
        <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">
              Pinned Delivery Address
            </span>
            {isGeocoding && <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />}
          </div>
          <p className="text-xs font-bold text-neutral-900 mt-1 leading-snug">
            {currentAddress}
          </p>
        </div>
      </div>
    </div>
  );
};
