import { render, screen } from '@testing-library/react';
import PropertyList from '../PropertyList';
import { Property } from '@/lib/api';

// Mock PropertyCard component
jest.mock('../PropertyCard', () => {
  return function MockPropertyCard({ property }: { property: Property }) {
    return <div data-testid={`property-card-${property.id}`}>{property.name}</div>;
  };
});

describe('PropertyList', () => {
  const mockProperties: Property[] = [
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
    {
      id: '3',
      idOwner: 'owner3',
      name: 'Property 3',
      address: 'Address 3',
      price: 300000,
      image: 'https://example.com/image3.jpg',
    },
  ];

  it('should render all properties', () => {
    render(<PropertyList properties={mockProperties} />);

    expect(screen.getByTestId('property-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('property-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('property-card-3')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    render(<PropertyList properties={[]} loading={true} />);

    expect(screen.getByText(/cargando propiedades/i)).toBeInTheDocument();
  });

  it('should display empty state when no properties', () => {
    render(<PropertyList properties={[]} />);

    expect(screen.getByText(/no se encontraron propiedades/i)).toBeInTheDocument();
    expect(screen.getByText(/intenta ajustar tus filtros/i)).toBeInTheDocument();
  });

  it('should not display loading state when properties are present', () => {
    render(<PropertyList properties={mockProperties} loading={false} />);

    expect(screen.queryByText(/cargando propiedades/i)).not.toBeInTheDocument();
  });

  it('should render correct number of property cards', () => {
    render(<PropertyList properties={mockProperties} />);

    const propertyCards = screen.getAllByTestId(/property-card-/);
    expect(propertyCards).toHaveLength(3);
  });

  it('should handle single property', () => {
    render(<PropertyList properties={[mockProperties[0]]} />);

    expect(screen.getByTestId('property-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('property-card-2')).not.toBeInTheDocument();
  });
});

