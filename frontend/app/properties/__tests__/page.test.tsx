import { render, screen, waitFor } from '@testing-library/react';
import PropertiesPage from '../page';
import { propertyApi } from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  propertyApi: {
    getAll: jest.fn(),
    search: jest.fn(),
  },
}));

// Mock components
jest.mock('@/components/PropertyFilter', () => {
  return function MockPropertyFilter({ onFilterChange }: any) {
    return (
      <div data-testid="property-filter">
        <button onClick={() => onFilterChange({ name: 'Test' })}>
          Apply Filter
        </button>
      </div>
    );
  };
});

jest.mock('@/components/PropertyList', () => {
  return function MockPropertyList({ properties, loading }: any) {
    if (loading) return <div>Loading...</div>;
    return (
      <div data-testid="property-list">
        {properties.map((p: any) => (
          <div key={p.id}>{p.name}</div>
        ))}
      </div>
    );
  };
});

describe('PropertiesPage', () => {
  const mockProperties = [
    {
      id: '1',
      idOwner: 'owner1',
      name: 'Property 1',
      address: 'Address 1',
      price: 100000,
      image: 'https://example.com/image1.jpg',
    },
    {
      id: '2',
      idOwner: 'owner2',
      name: 'Property 2',
      address: 'Address 2',
      price: 200000,
      image: 'https://example.com/image2.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render page title', () => {
    (propertyApi.getAll as jest.Mock).mockResolvedValue(mockProperties);

    render(<PropertiesPage />);

    expect(screen.getByText(/explorar propiedades/i)).toBeInTheDocument();
  });

  it('should fetch and display properties on mount', async () => {
    (propertyApi.getAll as jest.Mock).mockResolvedValue(mockProperties);

    render(<PropertiesPage />);

    await waitFor(() => {
      expect(propertyApi.getAll).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText('Property 1')).toBeInTheDocument();
      expect(screen.getByText('Property 2')).toBeInTheDocument();
    });
  });

  it('should display property count', async () => {
    (propertyApi.getAll as jest.Mock).mockResolvedValue(mockProperties);

    render(<PropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText(/mostrando 2 propiedades/i)).toBeInTheDocument();
    });
  });

  it('should display singular form for one property', async () => {
    (propertyApi.getAll as jest.Mock).mockResolvedValue([mockProperties[0]]);

    render(<PropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText(/mostrando 1 propiedad/i)).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    (propertyApi.getAll as jest.Mock).mockResolvedValue(mockProperties);

    render(<PropertiesPage />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should handle errors gracefully', async () => {
    const errorMessage = 'Network error';
    (propertyApi.getAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(<PropertiesPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/error al cargar las propiedades/i)
      ).toBeInTheDocument();
    });
  });

  it('should use search API when filters are applied', async () => {
    (propertyApi.getAll as jest.Mock).mockResolvedValue(mockProperties);
    (propertyApi.search as jest.Mock).mockResolvedValue([mockProperties[0]]);

    const { rerender } = render(<PropertiesPage />);

    await waitFor(() => {
      expect(propertyApi.getAll).toHaveBeenCalled();
    });

    // Simulate filter change
    const filterButton = screen.getByText('Apply Filter');
    filterButton.click();

    await waitFor(() => {
      expect(propertyApi.search).toHaveBeenCalledWith({ name: 'Test' });
    });
  });

  it('should render PropertyFilter component', async () => {
    (propertyApi.getAll as jest.Mock).mockResolvedValue(mockProperties);

    render(<PropertiesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('property-filter')).toBeInTheDocument();
    });
  });

  it('should render PropertyList component', async () => {
    (propertyApi.getAll as jest.Mock).mockResolvedValue(mockProperties);

    render(<PropertiesPage />);

    await waitFor(() => {
      expect(screen.getByTestId('property-list')).toBeInTheDocument();
    });
  });

  it('should handle empty property list', async () => {
    (propertyApi.getAll as jest.Mock).mockResolvedValue([]);

    render(<PropertiesPage />);

    await waitFor(() => {
      expect(screen.getByText(/mostrando 0 propiedades/i)).toBeInTheDocument();
    });
  });
});

