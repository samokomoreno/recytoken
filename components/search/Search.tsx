import React, { useState, useContext, useMemo } from 'react';
import { AppContext, AppContextType } from '../../context/AppContext';
import { Center, Material, MaterialCategory, Section } from '../../types';
import { SearchIcon, LocationMarkerIcon, PhoneIcon, MailIcon } from '../common/Icons';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

// Extend the Window interface to include our custom property
declare global {
  interface Window {
    GOOGLE_MAPS_API_KEY?: string;
  }
}

const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const mapOptions = {
    styles: [
        { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
        { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
        { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
        { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
        { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
        { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
        { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
        { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
    ],
    disableDefaultUI: true,
    zoomControl: true,
};

const MapErrorComponent: React.FC = () => (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/20">
        <div className="text-center p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-lg max-w-lg">
            <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="mt-4 font-bold text-red-800 dark:text-red-200 text-xl">Error al Cargar el Mapa de Google</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                Esto suele ser un problema de configuración de la clave de API (`ApiProjectMapError`). Por favor, sigue estos pasos en tu <strong>Google Cloud Console</strong>:
            </p>
            <ol className="mt-4 text-left text-sm text-neutral-500 dark:text-neutral-400 list-decimal list-inside space-y-2">
                <li>Asegúrate de que la API <strong>"Maps JavaScript API"</strong> esté habilitada para tu proyecto.</li>
                <li>Verifica que la <strong>Facturación (Billing)</strong> esté activada para tu proyecto.</li>
                <li>Revisa que tu clave de API no tenga restricciones de sitios web que impidan el acceso.</li>
                <li>Confirma que la clave de API en el archivo de configuración es la correcta.</li>
                <li>Espera unos minutos. A veces, los cambios en Google Cloud tardan en aplicarse.</li>
            </ol>
        </div>
    </div>
);


const Search: React.FC = () => {
    const { centers, materials, setActiveSection, setMarketplaceMaterialId } = useContext(AppContext) as AppContextType;
    const [filters, setFilters] = useState({ category: 'Todas', location: 'Todas' });
    const [appliedFilters, setAppliedFilters] = useState({ category: 'Todas', location: 'Todas' });
    const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);

    const apiKey = window.GOOGLE_MAPS_API_KEY;

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: apiKey!,
        preventGoogleFontsLoading: true,
    });

    const locations = useMemo(() => ['Todas', ...Array.from(new Set(centers.map(c => c.city)))], [centers]);
    const categories = useMemo(() => ['Todas', ...Object.values(MaterialCategory)], []);

    const filteredCenters = useMemo(() => {
        return centers.filter(center => {
            const locationMatch = appliedFilters.location === 'Todas' || center.city === appliedFilters.location;
            if (!locationMatch) return false;

            if (appliedFilters.category !== 'Todas') {
                const centerMaterials = materials.filter(m => m.location === center.city);
                return centerMaterials.some(m => m.category === appliedFilters.category);
            }
            return true;
        });
    }, [centers, materials, appliedFilters]);
    
    const handleBuyClick = (material: Material) => {
        setSelectedCenter(null);
        setMarketplaceMaterialId(material.id);
        setActiveSection(Section.Marketplace);
    };

    const handleSearch = () => {
        setAppliedFilters(filters);
        setSelectedCenter(null);
    };

    const renderMap = () => {
        if (loadError) return <MapErrorComponent />;
        if (!isLoaded) return <div className="h-full w-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-lg font-semibold">Cargando mapa...</div>;
        
        return (
             <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{ lat: 12.8654, lng: -85.2072 }} // Centered on Nicaragua
                zoom={7}
                options={mapOptions}
            >
                {filteredCenters.map(center => (
                    <Marker
                        key={center.id}
                        position={{ lat: parseFloat(center.latitude), lng: parseFloat(center.longitude) }}
                        onClick={() => setSelectedCenter(center)}
                    />
                ))}

                {selectedCenter && (
                    <InfoWindow
                        position={{ lat: parseFloat(selectedCenter.latitude), lng: parseFloat(selectedCenter.longitude) }}
                        onCloseClick={() => setSelectedCenter(null)}
                    >
                        <div className="p-2 max-w-sm text-neutral-800">
                            <h3 className="font-bold text-lg mb-2">{selectedCenter.companyName}</h3>
                            <p className="flex items-center gap-2 text-sm"><LocationMarkerIcon className="w-4 h-4 text-neutral-500"/>{selectedCenter.fullAddress}</p>
                            <p className="flex items-center gap-2 text-sm"><PhoneIcon className="w-4 h-4 text-neutral-500"/>{selectedCenter.phone}</p>
                            <p className="flex items-center gap-2 text-sm"><MailIcon className="w-4 h-4 text-neutral-500"/>{selectedCenter.email}</p>
                            <div className="mt-4">
                                <h4 className="font-semibold border-t pt-2">Materiales Disponibles:</h4>
                                <div className="max-h-32 overflow-y-auto mt-2 space-y-2">
                                    {materials.filter(m => m.location === selectedCenter.city).length > 0 ? 
                                        materials.filter(m => m.location === selectedCenter.city).map(material => (
                                            <div key={material.id} className="flex justify-between items-center bg-neutral-50 p-2 rounded-md">
                                                <div>
                                                    <p className="font-bold text-sm">{material.name}</p>
                                                    <p className="text-xs">{material.inventoryKg} kg @ {material.pricePerKg.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}/kg</p>
                                                </div>
                                                <button onClick={() => handleBuyClick(material)} className="bg-primary-600 text-white text-xs px-3 py-1 rounded-md hover:bg-primary-700">Comprar</button>
                                            </div>
                                        )) : <p className="text-sm text-neutral-500 italic">No hay materiales registrados.</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        )
    }

    if (!apiKey) {
        return (
           <div className="h-full w-full flex flex-col items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-900">
               <div className="text-center p-6 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg shadow">
                   <h3 className="font-bold text-yellow-800 dark:text-yellow-200">Configuración Requerida</h3>
                   <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                       La clave de API de Google Maps no está configurada.
                   </p>
               </div>
           </div>
       );
   }

    return (
        <div className="h-[calc(100vh-10rem)] flex flex-col space-y-4">
             <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:flex-1">
                    <label htmlFor="category" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Categoría de Material</label>
                    <select id="category" name="category" value={filters.category} onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))} className="mt-1 input-field">
                        {categories.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="w-full md:flex-1">
                    <label htmlFor="location" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Ubicación (Ciudad)</label>
                     <select id="location" name="location" value={filters.location} onChange={(e) => setFilters(prev => ({...prev, location: e.target.value}))} className="mt-1 input-field">
                        {locations.map(loc => <option key={loc}>{loc}</option>)}
                    </select>
                </div>
                 <div className="w-full md:w-auto">
                    <button 
                        onClick={handleSearch} 
                        className="w-full bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                        <SearchIcon className="h-5 w-5 text-white" />
                        Buscar
                    </button>
                </div>
            </div>
            <div className="flex-grow rounded-lg overflow-hidden shadow-md bg-neutral-200 dark:bg-neutral-900">
                {renderMap()}
            </div>
        </div>
    );
};

export default Search;