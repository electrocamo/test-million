import { render, screen } from '@testing-library/react';
import Home from '../page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Home Page', () => {
  it('should render main heading', () => {
    render(<Home />);

    expect(screen.getByText(/encuentra la propiedad de tus sueños/i)).toBeInTheDocument();
  });

  it('should render hero description', () => {
    render(<Home />);

    expect(
      screen.getByText(/explora miles de propiedades para encontrar el hogar perfecto/i)
    ).toBeInTheDocument();
  });

  it('should have a link to properties page', () => {
    render(<Home />);

    const link = screen.getByRole('link', { name: /ver propiedades/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/properties');
  });

  it('should have a learn more button', () => {
    render(<Home />);

    const button = screen.getByRole('link', { name: /saber más/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '#features');
  });

  it('should render features section', () => {
    render(<Home />);

    expect(screen.getByText(/¿por qué elegirnos\?/i)).toBeInTheDocument();
  });

  it('should render all three feature cards', () => {
    render(<Home />);

    expect(screen.getByText(/búsqueda avanzada/i)).toBeInTheDocument();
    expect(screen.getByText(/mejores precios/i)).toBeInTheDocument();
    expect(screen.getByText(/diseño responsivo/i)).toBeInTheDocument();
  });

  it('should render feature icons', () => {
    render(<Home />);

    expect(screen.getByText('🔍')).toBeInTheDocument();
    expect(screen.getByText('💰')).toBeInTheDocument();
    expect(screen.getByText('📱')).toBeInTheDocument();
  });

  it('should render feature descriptions', () => {
    render(<Home />);

    expect(
      screen.getByText(/filtra propiedades por nombre, dirección y rango de precio/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/precios competitivos y opciones flexibles/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/accede a listados de propiedades desde cualquier dispositivo/i)
    ).toBeInTheDocument();
  });
});

