/**
 * SearchForm component tests
 */

import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from '@/components/SearchForm';

describe('SearchForm', () => {
  const mockOnSearch = jest.fn();
  const mockOnGeolocation = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
    mockOnGeolocation.mockClear();
  });

  it('renders the search form', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByLabelText(/where are you looking for food/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /find restaurants/i })).toBeInTheDocument();
  });

  it('calls onSearch when form is submitted with valid input', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);

    const input = screen.getByPlaceholderText(/enter address, neighborhood/i);
    const button = screen.getByRole('button', { name: /find restaurants/i });

    fireEvent.change(input, { target: { value: 'San Francisco' } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('San Francisco');
  });

  it('disables submit button when input is empty', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);
    const button = screen.getByRole('button', { name: /find restaurants/i });
    expect(button).toBeDisabled();
  });

  it('disables input and buttons when loading', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={true} />);
    const input = screen.getByPlaceholderText(/enter address, neighborhood/i);
    expect(input).toBeDisabled();
    expect(screen.getByText(/finding restaurants/i)).toBeInTheDocument();
  });

  it('renders quick suggestion buttons', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);
    expect(screen.getByRole('button', { name: 'Downtown SF' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mission District' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SOMA' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '94102' })).toBeInTheDocument();
  });

  it('calls onSearch when quick suggestion is clicked', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);
    const suggestionButton = screen.getByRole('button', { name: 'Downtown SF' });
    fireEvent.click(suggestionButton);
    expect(mockOnSearch).toHaveBeenCalledWith('Downtown SF');
  });

  it('renders geolocation button', () => {
    render(<SearchForm onSearch={mockOnSearch} onGeolocation={mockOnGeolocation} isLoading={false} />);
    expect(screen.getByRole('button', { name: /use my location/i })).toBeInTheDocument();
  });

  it('trims whitespace from input before search', () => {
    render(<SearchForm onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByPlaceholderText(/enter address, neighborhood/i);
    const button = screen.getByRole('button', { name: /find restaurants/i });

    fireEvent.change(input, { target: { value: '  San Francisco  ' } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('San Francisco');
  });
});
