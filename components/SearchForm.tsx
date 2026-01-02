'use client';

import { useState, FormEvent } from 'react';

interface SearchFormProps {
  onSearch: (location: string) => void;
  onGeolocation?: (latitude: number, longitude: number) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, onGeolocation, isLoading }: SearchFormProps) {
  const [location, setLocation] = useState('');
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (location.trim()) {
      setGeoError(null);
      onSearch(location.trim());
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setIsGeolocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGeolocating(false);
        setLocation('Current Location');
        if (onGeolocation) {
          onGeolocation(position.coords.latitude, position.coords.longitude);
        } else {
          onSearch(`${position.coords.latitude},${position.coords.longitude}`);
        }
      },
      (error) => {
        setIsGeolocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setGeoError('Location request timed out.');
            break;
          default:
            setGeoError('An unknown error occurred.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const isDisabled = isLoading || isGeolocating;

  return (
    <div className="glass rounded-2xl p-8 shadow-xl">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          {/* Search Input Group */}
          <div className="relative">
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-3">
              Where are you looking for food?
            </label>
            <div className="relative flex gap-3">
              {/* Location Icon */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter address, neighborhood, or zip code..."
                className="flex-1 pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl input-focus focus:border-red-400 outline-none text-gray-800 placeholder-gray-400 text-lg"
                disabled={isDisabled}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isDisabled || !location.trim()}
              className="flex-1 px-8 py-4 btn-primary text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-lg"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Finding restaurants...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Find Restaurants</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleGeolocation}
              disabled={isDisabled}
              className="px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGeolocating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="hidden sm:inline">Use My Location</span>
                  <span className="sm:hidden">GPS</span>
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {geoError && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{geoError}</span>
            </div>
          )}

          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-sm text-gray-500">Try:</span>
            {['Downtown SF', 'Mission District', 'SOMA', '94102'].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setLocation(suggestion);
                  onSearch(suggestion);
                }}
                disabled={isDisabled}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-600 rounded-full transition-all disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
