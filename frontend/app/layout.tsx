import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Million Luxury - Listado de Propiedades',
  description: 'Explora y busca propiedades en tu área',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <header className="header">
          <div className="container">
            <h1 className="logo">🏠 Million Luxury</h1>
            <nav>
              <a href="/">Inicio</a>
              <a href="/properties">Propiedades</a>
            </nav>
          </div>
        </header>
        <main className="main">
          {children}
        </main>
        <footer className="footer">
          <div className="container">
            <p>&copy; 2025 Million Luxury. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}


