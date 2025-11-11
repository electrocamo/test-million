import Link from 'next/link';
import { Property } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import styles from './PropertyCard.module.css';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={property.image || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
          alt={property.name}
          className={styles.image}
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
          }}
        />
        <div className={styles.priceTag}>
          {formatPrice(property.price)}
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{property.name}</h3>
        <p className={styles.address}>📍 {property.address}</p>
        <div className={styles.footer}>
          <Link 
            href={`/properties/${property.id}`} 
            className={styles.viewButton}
          >
            Ver Detalles
          </Link>
        </div>
      </div>
    </div>
  );
}


