'use client';

import { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import RestaurantCard from '@/components/RestaurantCard';
import { Restaurant } from '@/types/restaurant';

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');

  const handleSearch = async (location: string) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchLocation(location);

    try {
      const response = await fetch(`/api/restaurants?address=${encodeURIComponent(location)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch restaurants');
      }

      setRestaurants(data.restaurants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGeolocation = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchLocation('Current Location');

    try {
      const response = await fetch(`/api/restaurants?lat=${lat}&lng=${lng}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch restaurants');
      }

      setRestaurants(data.restaurants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid-pattern">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="hero-pattern absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 pt-12 pb-8 sm:px-6 lg:px-8">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg animate-bounce-subtle">
              <span className="text-4xl">🍽️</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
              <span className="gradient-text">Restaurant Finder</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              Discover amazing places to eat near you. Fresh finds, just for you.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-2xl mx-auto">
            <SearchForm
              onSearch={handleSearch}
              onGeolocation={handleGeolocation}
              isLoading={loading}
            />
          </div>
        </div>
      </header>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-red-200 rounded-full animate-spin border-t-red-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">🍽️</span>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Finding delicious spots near you...</p>
            <p className="mt-1 text-sm text-gray-400">This won&apos;t take long</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-lg mx-auto animate-fade-in">
            <div className="glass rounded-2xl p-6 border-l-4 border-red-500">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Oops! Something went wrong</h3>
                  <p className="mt-1 text-gray-600">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="mt-3 text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty Results State */}
        {!loading && hasSearched && restaurants.length === 0 && !error && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No restaurants found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn&apos;t find any restaurants near &quot;{searchLocation}&quot;.
              Try searching for a different location.
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && restaurants.length > 0 && (
          <div className="animate-fade-in">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {restaurants.length} Restaurants Found
                </h2>
                <p className="text-gray-500 mt-1">
                  Near {searchLocation}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span>Sorted by distance</span>
              </div>
            </div>

            {/* Restaurant Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {restaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  index={index}
                />
              ))}
            </div>

            {/* Load More Hint */}
            <div className="text-center mt-10">
              <p className="text-sm text-gray-400">
                Showing top {restaurants.length} closest restaurants
              </p>
            </div>
          </div>
        )}

        {/* Initial State - Before Search */}
        {!hasSearched && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
              <span className="text-5xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Ready to find your next meal?
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Enter your location above to discover the best restaurants nearby.
              We&apos;ll find the closest and highest-rated options for you.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: '📍', label: 'Location-based' },
                { icon: '⭐', label: 'Top rated' },
                { icon: '🕐', label: 'Open now' },
                { icon: '💰', label: 'All budgets' },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm text-gray-600"
                >
                  <span>{feature.icon}</span>
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <span className="font-semibold text-gray-700">Restaurant Finder</span>
            </div>
            <p className="text-sm text-gray-500">
              AI Workshop Demo Application
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Made with ❤️</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
