'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { propertyApi, Property, PropertyFilter as PropertyFilterType } from '@/lib/api';
import PropertyFilter from '@/components/PropertyFilter';
import PropertyList from '@/components/PropertyList';
import styles from './page.module.css';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilterType>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        setError(null);
        
        // Check if any filter is applied
        const hasFilters = Object.values(filters).some(value => value !== undefined && value !== '');
        
        const data = hasFilters 
          ? await propertyApi.search(filters)
          : await propertyApi.getAll();
        
        setProperties(data);
      } catch (err: any) {
        // Ignore abort errors
        if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
          return;
        }
        console.error('Error al cargar propiedades:', err);
        setError('Error al cargar las propiedades. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [filters]);

  const handleFilterChange = useCallback((newFilters: PropertyFilterType) => {
    // Only update if filters actually changed
    setFilters(prevFilters => {
      const filtersChanged = JSON.stringify(prevFilters) !== JSON.stringify(newFilters);
      return filtersChanged ? newFilters : prevFilters;
    });
  }, []);

  return (
    <div className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>Explorar Propiedades</h1>
        <p className={styles.description}>
          Mostrando {properties.length} {properties.length === 1 ? 'propiedad' : 'propiedades'}
        </p>
      </div>

      <PropertyFilter onFilterChange={handleFilterChange} />

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <PropertyList properties={properties} loading={loading} />
    </div>
  );
}


