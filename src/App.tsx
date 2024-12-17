
import { PrimeReactProvider } from 'primereact/api';
import ArtworkTable from './components/ArtworkTable';

// Import required PrimeReact styles
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function App() {
    return (
        <PrimeReactProvider>
            <div className="container mx-auto p-4">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Art Institute of Chicago Gallery Test
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Browse through the extensive collection of artworks
                    </p>
                </header>
                <ArtworkTable />
            </div>
        </PrimeReactProvider>
    );
}

export default App;