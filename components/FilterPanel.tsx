'use client';

import { useState } from 'react';

export interface Filters {
  cuisine: string | null;
  priceRange: string | null;
  minRating: number | null;
  openNow: boolean;
}

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  isLoading?: boolean;
}

const CUISINES = [
  'All',
  'American',
  'Brazilian',
  'Chinese',
  'Ethiopian',
  'French',
  'Greek',
  'Indian',
  'Italian',
  'Japanese',
  'Korean',
  'Mediterranean',
  'Mexican',
  'Peruvian',
  'Seafood',
  'Spanish',
  'Thai',
  'Vegan',
  'Vietnamese',
];

const PRICE_RANGES = ['All', '$', '$$', '$$$', '$$$$'];
const RATING_OPTIONS = [
  { label: 'All', value: null },
  { label: '4+ Stars', value: 4 },
  { label: '4.5+ Stars', value: 4.5 },
];

export default function FilterPanel({ filters, onFilterChange, isLoading }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCuisineChange = (cuisine: string) => {
    onFilterChange({
      ...filters,
      cuisine: cuisine === 'All' ? null : cuisine,
    });
  };

  const handlePriceChange = (price: string) => {
    onFilterChange({
      ...filters,
      priceRange: price === 'All' ? null : price,
    });
  };

  const handleRatingChange = (rating: number | null) => {
    onFilterChange({
      ...filters,
      minRating: rating,
    });
  };

  const handleOpenNowChange = () => {
    onFilterChange({
      ...filters,
      openNow: !filters.openNow,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      cuisine: null,
      priceRange: null,
      minRating: null,
      openNow: false,
    });
  };

  const activeFilterCount = [
    filters.cuisine,
    filters.priceRange,
    filters.minRating,
    filters.openNow,
  ].filter(Boolean).length;

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Filter Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/50 transition-colors"
        disabled={isLoading}
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="font-semibold text-gray-800">Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable Filter Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 space-y-6 border-t border-gray-200/50">
          {/* Cuisine Filter */}
          <div className="pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Cuisine</label>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => handleCuisineChange(cuisine)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                    (cuisine === 'All' && !filters.cuisine) || filters.cuisine === cuisine
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
            <div className="flex gap-2">
              {PRICE_RANGES.map((price) => (
                <button
                  key={price}
                  onClick={() => handlePriceChange(price)}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                    (price === 'All' && !filters.priceRange) || filters.priceRange === price
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Minimum Rating</label>
            <div className="flex gap-2">
              {RATING_OPTIONS.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleRatingChange(option.value)}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-all flex items-center gap-1 ${
                    filters.minRating === option.value
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {option.value && <span className="text-yellow-400">★</span>}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Open Now Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">Open Now Only</label>
            <button
              onClick={handleOpenNowChange}
              disabled={isLoading}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                filters.openNow ? 'bg-green-500' : 'bg-gray-300'
              } disabled:opacity-50`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  filters.openNow ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              disabled={isLoading}
              className="w-full py-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Quick Filters - Always visible when collapsed */}
      {!isExpanded && activeFilterCount > 0 && (
        <div className="px-6 pb-4 flex flex-wrap gap-2">
          {filters.cuisine && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
              {filters.cuisine}
              <button onClick={() => handleCuisineChange('All')} className="hover:text-red-900">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filters.priceRange && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
              {filters.priceRange}
              <button onClick={() => handlePriceChange('All')} className="hover:text-red-900">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filters.minRating && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
              ★ {filters.minRating}+
              <button onClick={() => handleRatingChange(null)} className="hover:text-red-900">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          {filters.openNow && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
              Open Now
              <button onClick={handleOpenNowChange} className="hover:text-green-900">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
