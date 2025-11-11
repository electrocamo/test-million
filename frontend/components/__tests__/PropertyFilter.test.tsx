import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyFilter from '../PropertyFilter';

describe('PropertyFilter', () => {
  jest.useFakeTimers();

  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
    jest.clearAllTimers();
  });

  it('should render all filter inputs', () => {
    render(<PropertyFilter onFilterChange={mockOnFilterChange} />);

    expect(screen.getByLabelText(/nombre de propiedad/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/precio mínimo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/precio máximo/i)).toBeInTheDocument();
  });

  it('should render reset button', () => {
    render(<PropertyFilter onFilterChange={mockOnFilterChange} />);

    expect(screen.getByRole('button', { name: /limpiar filtros/i })).toBeInTheDocument();
  });

  it('should call onFilterChange with debounce when name changes', async () => {
    render(<PropertyFilter onFilterChange={mockOnFilterChange} />);

    const nameInput = screen.getByLabelText(/nombre de propiedad/i);
    fireEvent.change(nameInput, { target: { value: 'Test Property' } });

    expect(mockOnFilterChange).not.toHaveBeenCalled();

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        name: 'Test Property',
        address: undefined,
        minPrice: undefined,
        maxPrice: undefined,
      });
    });
  });

  it('should call onFilterChange with debounce when address changes', async () => {
    render(<PropertyFilter onFilterChange={mockOnFilterChange} />);

    const addressInput = screen.getByLabelText(/dirección/i);
    fireEvent.change(addressInput, { target: { value: 'Test Address' } });

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        name: undefined,
        address: 'Test Address',
        minPrice: undefined,
        maxPrice: undefined,
      });
    });
  });

  it('should handle price filters correctly', async () => {
    render(<PropertyFilter onFilterChange={mockOnFilterChange} />);

    const minPriceInput = screen.getByLabelText(/precio mínimo/i);
    const maxPriceInput = screen.getByLabelText(/precio máximo/i);

    fireEvent.change(minPriceInput, { target: { value: '100000' } });
    fireEvent.change(maxPriceInput, { target: { value: '500000' } });

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        name: undefined,
        address: undefined,
        minPrice: 100000,
        maxPrice: 500000,
      });
    });
  });

  it('should reset all filters when reset button is clicked', async () => {
    render(<PropertyFilter onFilterChange={mockOnFilterChange} />);

    const nameInput = screen.getByLabelText(/nombre de propiedad/i) as HTMLInputElement;
    const addressInput = screen.getByLabelText(/dirección/i) as HTMLInputElement;
    const minPriceInput = screen.getByLabelText(/precio mínimo/i) as HTMLInputElement;
    const resetButton = screen.getByRole('button', { name: /limpiar filtros/i });

    // Set some values
    fireEvent.change(nameInput, { target: { value: 'Test' } });
    fireEvent.change(addressInput, { target: { value: 'Address' } });
    fireEvent.change(minPriceInput, { target: { value: '100000' } });

    jest.advanceTimersByTime(500);

    // Click reset
    fireEvent.click(resetButton);

    expect(nameInput.value).toBe('');
    expect(addressInput.value).toBe('');
    expect(minPriceInput.value).toBe('');
    expect(mockOnFilterChange).toHaveBeenCalledWith({});
  });

  it('should debounce multiple rapid changes', async () => {
    render(<PropertyFilter onFilterChange={mockOnFilterChange} />);

    const nameInput = screen.getByLabelText(/nombre de propiedad/i);

    // Rapid changes
    fireEvent.change(nameInput, { target: { value: 'T' } });
    jest.advanceTimersByTime(100);
    fireEvent.change(nameInput, { target: { value: 'Te' } });
    jest.advanceTimersByTime(100);
    fireEvent.change(nameInput, { target: { value: 'Test' } });

    // Should not be called yet
    expect(mockOnFilterChange).not.toHaveBeenCalled();

    // Wait for debounce
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      // Should only be called once with final value
      expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        name: 'Test',
        address: undefined,
        minPrice: undefined,
        maxPrice: undefined,
      });
    });
  });

  it('should handle empty string values as undefined', async () => {
    render(<PropertyFilter onFilterChange={mockOnFilterChange} />);

    const nameInput = screen.getByLabelText(/nombre de propiedad/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        name: undefined,
        address: undefined,
        minPrice: undefined,
        maxPrice: undefined,
      });
    });
  });

  it('should parse price inputs as numbers', async () => {
    render(<PropertyFilter onFilterChange={mockOnFilterChange} />);

    const minPriceInput = screen.getByLabelText(/precio mínimo/i);
    fireEvent.change(minPriceInput, { target: { value: '250000' } });

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        name: undefined,
        address: undefined,
        minPrice: 250000,
        maxPrice: undefined,
      });
    });
  });
});

