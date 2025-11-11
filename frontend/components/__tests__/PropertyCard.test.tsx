import { render, screen } from '@testing-library/react';
import PropertyCard from '../PropertyCard';
import { Property } from '@/lib/api';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('PropertyCard', () => {
  const mockProperty: Property = {
    id: '1',
    idOwner: 'owner1',
    name: 'Test Property',
    address: 'Test Address, City',
    price: 250000,
    image: 'https://example.com/image.jpg',
  };

  it('should render property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('📍 Test Address, City')).toBeInTheDocument();
    expect(screen.getByText('$250,000')).toBeInTheDocument();
  });

  it('should render property image with correct src', () => {
    render(<PropertyCard property={mockProperty} />);

    const image = screen.getByAltText('Test Property') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('example.com/image.jpg');
  });

  it('should render placeholder image when property image is empty', () => {
    const propertyWithoutImage = { ...mockProperty, image: '' };
    render(<PropertyCard property={propertyWithoutImage} />);

    const image = screen.getByAltText('Test Property') as HTMLImageElement;
    expect(image.src).toContain('placeholder');
  });

  it('should have a link to property details page', () => {
    render(<PropertyCard property={mockProperty} />);

    const link = screen.getByRole('link', { name: /ver detalles/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/properties/1');
  });

  it('should format price correctly', () => {
    const expensiveProperty = { ...mockProperty, price: 1500000 };
    render(<PropertyCard property={expensiveProperty} />);

    expect(screen.getByText('$1,500,000')).toBeInTheDocument();
  });

  it('should handle image load error', () => {
    render(<PropertyCard property={mockProperty} />);

    const image = screen.getByAltText('Test Property') as HTMLImageElement;
    
    // Simulate image error
    const errorEvent = new Event('error', { bubbles: true });
    image.dispatchEvent(errorEvent);

    expect(image.src).toContain('placeholder');
  });
});

