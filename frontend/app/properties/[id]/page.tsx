'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { propertyApi, Property } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import styles from './page.module.css';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await propertyApi.getById(params.id as string);
        setProperty(data);
      } catch (err) {
        console.error('Error al cargar propiedad:', err);
        setError('Error al cargar los detalles de la propiedad. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando detalles de la propiedad...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container">
        <div className="error">
          <strong>Error:</strong> {error || 'Propiedad no encontrada'}
        </div>
        <button onClick={() => router.back()} className="button" style={{ marginTop: '1rem' }}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => router.back()} className={styles.backButton}>
        ← Volver a Propiedades
      </button>

      <div className={styles.propertyDetail}>
        <div className={styles.imageContainer}>
          <img
            src={property.image || 'https://via.placeholder.com/800x600?text=Sin+Imagen'}
            alt={property.name}
            className={styles.image}
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/800x600?text=Sin+Imagen';
            }}
          />
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>{property.name}</h1>
            <div className={styles.price}>{formatPrice(property.price)}</div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Ubicación</h2>
            <p className={styles.address}>📍 {property.address}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Detalles de la Propiedad</h2>
            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>ID de Propiedad:</span>
                <span className={styles.detailValue}>{property.id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>ID del Propietario:</span>
                <span className={styles.detailValue}>{property.idOwner}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Precio:</span>
                <span className={styles.detailValue}>{formatPrice(property.price)}</span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button className="button" style={{ width: '100%' }}>
              Contactar Agente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


