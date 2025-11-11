'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { PropertyFilter as PropertyFilterType } from '@/lib/api';
import styles from './PropertyFilter.module.css';

interface PropertyFilterProps {
  onFilterChange: (filters: PropertyFilterType) => void;
}

export default function PropertyFilter({ onFilterChange }: PropertyFilterProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize filters to avoid creating new objects unnecessarily
  const filters = useMemo<PropertyFilterType>(() => ({
    name: name || undefined,
    address: address || undefined,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
  }), [name, address, minPrice, maxPrice]);

  // Debounced filter change
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onFilterChange(filters);
    }, 500);

    // Cleanup function to cancel pending debounced calls
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [filters, onFilterChange]);

  const handleReset = () => {
    setName('');
    setAddress('');
    setMinPrice('');
    setMaxPrice('');
    onFilterChange({});
  };

  return (
    <div className={styles.filterContainer}>
      <h2 className={styles.filterTitle}>Filtros de Búsqueda</h2>
      <div className={styles.filterGrid}>
        <div className={styles.filterGroup}>
          <label htmlFor="name" className={styles.label}>
            Nombre de Propiedad
          </label>
          <input
            id="name"
            type="text"
            className="input"
            placeholder="Buscar por nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="address" className={styles.label}>
            Dirección
          </label>
          <input
            id="address"
            type="text"
            className="input"
            placeholder="Buscar por dirección..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="minPrice" className={styles.label}>
            Precio Mínimo
          </label>
          <input
            id="minPrice"
            type="number"
            className="input"
            placeholder="$0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="maxPrice" className={styles.label}>
            Precio Máximo
          </label>
          <input
            id="maxPrice"
            type="number"
            className="input"
            placeholder="Cualquiera"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
          />
        </div>
      </div>

      <div className={styles.filterActions}>
        <button onClick={handleReset} className={`button button-secondary ${styles.resetButton}`}>
          Limpiar Filtros
        </button>
      </div>
    </div>
  );
}


