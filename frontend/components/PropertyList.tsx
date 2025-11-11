import { Property } from '@/lib/api';
import PropertyCard from './PropertyCard';
import styles from './PropertyList.module.css';

interface PropertyListProps {
  properties: Property[];
  loading?: boolean;
}

export default function PropertyList({ properties, loading }: PropertyListProps) {
  if (loading) {
    return (
      <div className="loading">
        <p>Cargando propiedades...</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="empty-state">
        <h2>No se Encontraron Propiedades</h2>
        <p>Intenta ajustar tus filtros de búsqueda para encontrar más propiedades.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}


