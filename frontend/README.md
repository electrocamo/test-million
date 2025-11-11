# Real Estate Frontend

Frontend application for the Real Estate API built with Next.js and TypeScript.

## Features

- Property listing with search and filters
- Responsive design for all devices
- Modern UI with CSS modules
- Filter by name, address, and price range
- Property details view

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on http://localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```bash
cp .env.local.example .env.local
```

3. Update the API URL in `.env.local` if needed:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Running the Application

Development mode:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Production build:
```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                  # Next.js 14 App Router
│   ├── properties/      # Properties pages
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/          # React components
│   ├── PropertyCard.tsx
│   ├── PropertyFilter.tsx
│   └── ...
├── lib/                 # Utilities and API client
│   └── api.ts
├── styles/             # CSS modules
│   └── *.module.css
└── public/             # Static assets
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **CSS Modules**: Scoped styling
- **Axios**: HTTP client for API calls


