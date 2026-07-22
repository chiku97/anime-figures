import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Search, Navigation, Check, X, Loader2 } from 'lucide-react';

// Fix Leaflet default icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPickerModal = ({ isOpen, onClose, onSelectLocation, initialCoords }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [position, setPosition] = useState(
    initialCoords?.lat && initialCoords?.lng
      ? [initialCoords.lat, initialCoords.lng]
      : [20.5937, 78.9629] // Default India center
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [locatingGps, setLocatingGps] = useState(false);
  const [addressDetails, setAddressDetails] = useState(null);

  // Reverse geocode latitude and longitude to structured address using OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    setResolving(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const street = [
          addr.house_number,
          addr.building,
          addr.road,
          addr.suburb,
          addr.neighbourhood,
          addr.residential
        ].filter(Boolean).join(', ') || data.display_name.split(',')[0];

        const city = addr.city || addr.town || addr.village || addr.county || addr.district || '';
        const state = addr.state || '';
        const pincode = addr.postcode || '';

        setAddressDetails({
          address1: street || 'Picked Location',
          city: city,
          state: state,
          pincode: pincode,
          lat: Number(lat.toFixed(6)),
          lng: Number(lng.toFixed(6)),
          displayName: data.display_name
        });
      }
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
      setAddressDetails({
        address1: 'Picked Map Location',
        city: '',
        state: '',
        pincode: '',
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
        displayName: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
      });
    } finally {
      setResolving(false);
    }
  };

  // Handle Search submit
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ', India')}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        setPosition([newLat, newLng]);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([newLat, newLng], 16);
          if (markerRef.current) {
            markerRef.current.setLatLng([newLat, newLng]);
          }
        }
        await reverseGeocode(newLat, newLng);
      }
    } catch (err) {
      console.error('Location search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  // Get User Current GPS Location
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;
        setPosition([newLat, newLng]);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([newLat, newLng], 16);
          if (markerRef.current) {
            markerRef.current.setLatLng([newLat, newLng]);
          }
        }
        await reverseGeocode(newLat, newLng);
        setLocatingGps(false);
      },
      (err) => {
        console.error('GPS Geolocation error:', err);
        alert('Could not retrieve your GPS location. Please select manually on the map.');
        setLocatingGps(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Initialize Leaflet Map when Modal opens
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    // Destroy existing map instance if present
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialPos = position;
    const map = L.map(mapContainerRef.current).setView(initialPos, 15);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = L.marker(initialPos, { draggable: true }).addTo(map);
    markerRef.current = marker;

    // Initial reverse geocode
    reverseGeocode(initialPos[0], initialPos[1]);

    // Handle Marker Drag End
    marker.on('dragend', async () => {
      const latLng = marker.getLatLng();
      setPosition([latLng.lat, latLng.lng]);
      await reverseGeocode(latLng.lat, latLng.lng);
    });

    // Handle Map Click
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      marker.setLatLng([lat, lng]);
      await reverseGeocode(lat, lng);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (addressDetails) {
      onSelectLocation(addressDetails);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-outfit">
      <div className="bg-white border border-primary/30 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-primary/15 flex items-center justify-between bg-warm-white">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-accent" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-primary">
              Pick Delivery Location on Map
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-secondary hover:text-primary hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Search & Action Bar */}
        <div className="p-4 bg-white border-b border-primary/10 space-y-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search city, area, landmark or street name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-primary/30 rounded-xl text-xs bg-warm-white focus:outline-none focus:border-accent text-primary font-semibold"
              />
              <Search className="w-4 h-4 text-secondary absolute left-3 top-2.5" />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 bg-primary hover:bg-opacity-95 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all disabled:opacity-50"
            >
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </form>

          <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
            <button
              type="button"
              onClick={handleUseGps}
              disabled={locatingGps}
              className="px-3.5 py-1.5 bg-accent/10 border border-accent/30 text-accent font-extrabold rounded-lg hover:bg-accent/20 transition-all flex items-center gap-1.5 text-[11px] disabled:opacity-50"
            >
              {locatingGps ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
              Use My Current GPS Location
            </button>
            <p className="text-[10px] text-secondary font-bold">
              💡 Tip: Click anywhere on map or drag the pin to position your delivery spot.
            </p>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative flex-1 min-h-[320px] w-full bg-gray-100">
          <div ref={mapContainerRef} className="h-full w-full min-h-[320px] z-10" />
          {resolving && (
            <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-primary/20 shadow text-xs font-bold text-primary flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-accent animate-spin" />
              Resolving address details...
            </div>
          )}
        </div>

        {/* Selected Address Preview Footer */}
        {addressDetails && (
          <div className="p-4 border-t border-primary/15 bg-warm-white space-y-3">
            <div className="text-left text-xs space-y-1 bg-white p-3 rounded-xl border border-primary/20 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-primary uppercase text-[10px] tracking-wider">
                  Detected Location:
                </span>
                <span className="font-mono text-[10px] text-secondary font-bold">
                  📍 {addressDetails.lat}, {addressDetails.lng}
                </span>
              </div>
              <p className="font-bold text-primary text-xs leading-relaxed">
                {addressDetails.address1}
              </p>
              <p className="text-secondary text-[11px] font-semibold">
                {addressDetails.city}{addressDetails.state ? `, ${addressDetails.state}` : ''} {addressDetails.pincode ? `— ${addressDetails.pincode}` : ''}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-primary/40 text-secondary hover:text-primary rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-6 py-2.5 bg-primary hover:bg-opacity-95 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow"
              >
                <Check className="w-4 h-4" />
                Confirm & Fill Address
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPickerModal;
