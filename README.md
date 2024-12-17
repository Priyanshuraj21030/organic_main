# Art Gallery Project

A React application that displays artwork data from the Art Institute of Chicago API with custom selection and pagination features.

## Features

- Fetches artwork data from Art Institute of Chicago API
- Server-side pagination (5 pages)
- Custom row selection:
  - Select rows on current page
  - Select rows across multiple pages
  - Customizable selection count
- Displays artwork details:
  - Title
  - Place of Origin
  - Artist
  - Inscriptions
  - Date Range

## Tech Stack

- React 18
- TypeScript
- Vite
- PrimeReact Components
- Axios

## Getting Started

1. Clone the repository

2. Install dependencies:
```bash
# Install project dependencies
npm install

# Install specific Vite version
npm install vite@4.5.0 --save-dev

# Install required packages
npm install primereact primeicons primeflex
npm install axios
npm install @types/react @types/react-dom --save-dev
```

3. Configure TypeScript:
Create or update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
  ├── components/
  │   └── ArtworkTable.tsx  # Main data table component
  ├── types/
  │   └── artwork.ts        # TypeScript interfaces
  ├── services/
  │   └── artworkService.ts # API service
  ├── App.tsx              # Root component
  └── main.tsx            # Entry point
```

## API Reference

This project uses the Art Institute of Chicago API:
- Base URL: `https://api.artic.edu/api/v1`
- Endpoint: `/artworks`
- Documentation: [Art Institute of Chicago API Docs](https://api.artic.edu/docs/)

## Known Issues

- React import requires `import * as React from 'react'` syntax for TypeScript compatibility
- Vite version must be 4.5.0 for stability

## Deployment

To deploy to Netlify:

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy!
