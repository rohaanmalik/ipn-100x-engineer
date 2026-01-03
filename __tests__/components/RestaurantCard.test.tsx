/**
 * RestaurantCard component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';
import RestaurantCard from '@/components/RestaurantCard';
import { FavoritesProvider } from '@/components/FavoritesContext';
import { Restaurant } from '@/types/restaurant';

const mockRestaurant: Restaurant = {
  id: '1',
  name: 'Test Restaurant',
  address: '123 Test Street, Test City, CA 12345',
  cuisine: 'Italian',
  rating: 4.5,
  priceRange: '$$',
  openingHours: '11:00',
  closingHours: '22:00',
  latitude: 37.7749,
  longitude: -122.4194,
  phone: '(555) 123-4567',
  description: 'A test restaurant for unit testing',
};

// Wrapper component that provides FavoritesContext
const renderWithFavorites = (ui: React.ReactElement) => {
  return render(<FavoritesProvider>{ui}</FavoritesProvider>);
};

describe('RestaurantCard', () => {
  it('renders restaurant name', () => {
    renderWithFavorites(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
  });

  it('displays the cuisine type', () => {
    renderWithFavorites(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('Italian')).toBeInTheDocument();
  });

  it('shows the rating', () => {
    renderWithFavorites(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('displays the price range', () => {
    renderWithFavorites(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText('$$')).toBeInTheDocument();
  });

  it('shows restaurant address', () => {
    renderWithFavorites(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText(mockRestaurant.address)).toBeInTheDocument();
  });

  it('displays opening hours', () => {
    renderWithFavorites(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByText(/11:00 AM/)).toBeInTheDocument();
    expect(screen.getByText(/10:00 PM/)).toBeInTheDocument();
  });

  it('has a favorite button that can be toggled', () => {
    renderWithFavorites(<RestaurantCard restaurant={mockRestaurant} />);
    const favoriteButton = screen.getByTitle('Add to favorites');
    expect(favoriteButton).toBeInTheDocument();

    fireEvent.click(favoriteButton);
    expect(screen.getByTitle('Remove from favorites')).toBeInTheDocument();
  });

  it('has a View Details button', () => {
    renderWithFavorites(<RestaurantCard restaurant={mockRestaurant} />);
    expect(screen.getByRole('button', { name: /view details/i })).toBeInTheDocument();
  });

  it('has a phone link', () => {
    renderWithFavorites(<RestaurantCard restaurant={mockRestaurant} />);
    const phoneLink = screen.getByTitle(`Call ${mockRestaurant.phone}`);
    expect(phoneLink).toBeInTheDocument();
    expect(phoneLink).toHaveAttribute('href', `tel:${mockRestaurant.phone}`);
  });
});
