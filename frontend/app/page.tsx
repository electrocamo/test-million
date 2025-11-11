import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.hero}>
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Encuentra la Propiedad de tus Sueños
          </h1>
          <p className={styles.heroDescription}>
            Explora miles de propiedades para encontrar el hogar perfecto para ti y tu familia. 
          </p>
          <p className={styles.heroDescription}> 
            Adrian Sanchez Test
          </p>
          <div className={styles.heroActions}>
            <Link href="/properties" className="button">
              Ver Propiedades
            </Link>
            <a href="#features" className="button button-secondary">
              Saber Más
            </a>
          </div>
        </div>

        <section id="features" className={styles.features}>
          <h2 className={styles.featuresTitle}>¿Por Qué Elegirnos?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔍</div>
              <h3>Búsqueda Avanzada</h3>
              <p>Filtra propiedades por nombre, dirección y rango de precio para encontrar exactamente lo que necesitas.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h3>Mejores Precios</h3>
              <p>Precios competitivos y opciones flexibles para cualquier presupuesto.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h3>Diseño Responsivo</h3>
              <p>Accede a listados de propiedades desde cualquier dispositivo, en cualquier lugar y momento.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}


