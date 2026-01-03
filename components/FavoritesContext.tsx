'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Restaurant } from '@/types/restaurant';

interface FavoritesContextType {
  favorites: Set<string>;
  toggleFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
  getFavoriteRestaurants: (restaurants: Restaurant[]) => Restaurant[];
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'restaurant-finder-favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(new Set(parsed));
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = (restaurantId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(restaurantId)) {
        next.delete(restaurantId);
      } else {
        next.add(restaurantId);
      }
      return next;
    });
  };

  const isFavorite = (restaurantId: string) => {
    return favorites.has(restaurantId);
  };

  const getFavoriteRestaurants = (restaurants: Restaurant[]) => {
    return restaurants.filter((r) => favorites.has(r.id));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        getFavoriteRestaurants,
        favoritesCount: favorites.size,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
