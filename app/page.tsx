'use client';

import { useState, useMemo } from 'react';
import SearchForm from '@/components/SearchForm';
import RestaurantCard from '@/components/RestaurantCard';
import FilterPanel, { Filters } from '@/components/FilterPanel';
import ThemeToggle from '@/components/ThemeToggle';
import { useFavorites } from '@/components/FavoritesContext';
import { Restaurant } from '@/types/restaurant';

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    cuisine: null,
    priceRange: null,
    minRating: null,
    openNow: false,
  });

  const { favoritesCount, getFavoriteRestaurants } = useFavorites();

  const handleSearch = async (location: string) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchLocation(location);
    setShowFavorites(false);

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
    setShowFavorites(false);

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

  // Filter restaurants based on active filters
  const filteredRestaurants = useMemo(() => {
    let result = showFavorites ? getFavoriteRestaurants(restaurants) : restaurants;

    if (filters.cuisine) {
      result = result.filter((r) => r.cuisine === filters.cuisine);
    }

    if (filters.priceRange) {
      result = result.filter((r) => r.priceRange === filters.priceRange);
    }

    if (filters.minRating) {
      result = result.filter((r) => r.rating >= filters.minRating!);
    }

    if (filters.openNow) {
      result = result.filter((r) => {
        if (!r.openingHours || !r.closingHours) return false;
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const [openH, openM] = r.openingHours.split(':').map(Number);
        const [closeH, closeM] = r.closingHours.split(':').map(Number);
        const openMinutes = openH * 60 + openM;
        const closeMinutes = closeH * 60 + closeM;
        if (closeMinutes < openMinutes) {
          return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
        }
        return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
      });
    }

    return result;
  }, [restaurants, filters, showFavorites, getFavoriteRestaurants]);

  return (
    <main className="min-h-screen grid-pattern dark:bg-gray-900">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="hero-pattern absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-8 sm:px-6 lg:px-8">
          {/* Top Bar with Theme Toggle */}
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>

          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl shadow-lg animate-bounce-subtle">
              <span className="text-4xl">🍽️</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">
              <span className="gradient-text">Restaurant Finder</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
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
        {/* Filters & Favorites Toggle */}
        {hasSearched && !loading && restaurants.length > 0 && (
          <div className="space-y-4 mb-6 animate-fade-in">
            {/* Favorites Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFavorites(false)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  !showFavorites
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                All Results
              </button>
              <button
                onClick={() => setShowFavorites(true)}
                className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  showFavorites
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Favorites
                {favoritesCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Panel */}
            <FilterPanel
              filters={filters}
              onFilterChange={setFilters}
              isLoading={loading}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-red-200 dark:border-red-900 rounded-full animate-spin border-t-red-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">🍽️</span>
              </div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Finding delicious spots near you...</p>
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">This won&apos;t take long</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-lg mx-auto animate-fade-in">
            <div className="glass dark:glass-dark rounded-2xl p-6 border-l-4 border-red-500">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Oops! Something went wrong</h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">{error}</p>
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

        {/* Empty Favorites State */}
        {!loading && showFavorites && filteredRestaurants.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No favorites yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Click the heart icon on any restaurant to add it to your favorites.
            </p>
            <button
              onClick={() => setShowFavorites(false)}
              className="mt-4 px-4 py-2 text-red-500 hover:text-red-600 font-medium"
            >
              View all results
            </button>
          </div>
        )}

        {/* Empty Results State */}
        {!loading && hasSearched && !showFavorites && restaurants.length === 0 && !error && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No restaurants found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              We couldn&apos;t find any restaurants near &quot;{searchLocation}&quot;.
              Try searching for a different location.
            </p>
          </div>
        )}

        {/* No Filtered Results */}
        {!loading && hasSearched && restaurants.length > 0 && filteredRestaurants.length === 0 && !showFavorites && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No matches found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              No restaurants match your current filters. Try adjusting them.
            </p>
            <button
              onClick={() => setFilters({ cuisine: null, priceRange: null, minRating: null, openNow: false })}
              className="mt-4 px-4 py-2 text-red-500 hover:text-red-600 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && filteredRestaurants.length > 0 && (
          <div className="animate-fade-in">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {showFavorites ? 'Your Favorites' : `${filteredRestaurants.length} Restaurants Found`}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {showFavorites ? `${filteredRestaurants.length} saved` : `Near ${searchLocation}`}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                <span>Sorted by distance</span>
              </div>
            </div>

            {/* Restaurant Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRestaurants.map((restaurant, index) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  index={index}
                />
              ))}
            </div>

            {/* Load More Hint */}
            <div className="text-center mt-10">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Showing {filteredRestaurants.length} restaurants
              </p>
            </div>
          </div>
        )}

        {/* Initial State - Before Search */}
        {!hasSearched && (
          <div className="text-center py-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full">
              <span className="text-5xl">🔍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Ready to find your next meal?
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
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
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-sm text-gray-600 dark:text-gray-300"
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
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍽️</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Restaurant Finder</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI Workshop Demo Application
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
              <span>Made with ❤️</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
