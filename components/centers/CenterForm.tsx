
// FIX: Create CenterForm component to be used in Centers.tsx.
import React, { useState, useEffect } from 'react';
import { Center, PersonType, CenterClassification } from '../../types';
import { IdCardIcon, PhoneIcon, LocationMarkerIcon, GlobeAltIcon } from '../common/Icons';

interface CenterFormProps {
    center?: Center;
    onSave: (center: Center) => void;
    onCancel: () => void;
}

const nicaraguanCities = [
    "Managua", "León", "Granada", "Masaya", "Chinandega", "Matagalpa", "Estelí",
    "Jinotega", "Nueva Segovia", "Madriz", "Boaco", "Chontales", "Río San Juan",
    "RACCS", "RACCN"
];

const cityCoordinates: { [key: string]: { lat: string, lng: string } } = {
    Managua: { lat: "12.1364", lng: "-86.2514" },
    León: { lat: "12.4333", lng: "-86.8833" },
    Granada: { lat: "11.9344", lng: "-85.9560" },
    Masaya: { lat: "11.9738", lng: "-86.0940" },
};


const CenterForm: React.FC<CenterFormProps> = ({ center, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Center, 'id' | 'processedMaterials' | 'rating' | 'reviews' | 'status'>>({
        clientId: '',
        companyName: '',
        personType: PersonType.Natural,
        classification: CenterClassification.Cliente,
        taxId: '',
        phone: '',
        email: '',
        website: '',
        country: 'Nicaragua',
        city: 'Managua',
        fullAddress: '',
        latitude: '12.1364',
        longitude: '-86.2514',
    });

    useEffect(() => {
        if (center) {
            setFormData({
                clientId: center.clientId,
                companyName: center.companyName,
                personType: center.personType,
                classification: center.classification,
                taxId: center.taxId,
                phone: center.phone,
                email: center.email,
                website: center.website,
                country: center.country,
                city: center.city,
                fullAddress: center.fullAddress,
                latitude: center.latitude,
                longitude: center.longitude,
            });
        } else {
            // Set default coords for Managua on new form
            setFormData(prev => ({...prev, ...cityCoordinates['Managua']}));
        }
    }, [center]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'city' && cityCoordinates[value]) {
            setFormData(prev => ({ ...prev, ...cityCoordinates[value] }));
        }
    };
    
    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setFormData(prev => ({
                    ...prev,
                    latitude: position.coords.latitude.toFixed(4),
                    longitude: position.coords.longitude.toFixed(4),
                }));
            }, (error) => {
                console.error("Error getting location", error);
                alert("No se pudo obtener la ubicación.");
            });
        } else {
            alert("La geolocalización no es soportada por este navegador.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCenter: Center = {
            id: center?.id || `C${Date.now()}`,
            processedMaterials: center?.processedMaterials || 0,
            // FIX: Convert the result of toFixed(1) from string to number using parseFloat to match the 'rating: number' type.
            rating: center?.rating || parseFloat((Math.random() * 2 + 3).toFixed(1)), // Random rating between 3 and 5
            reviews: center?.reviews || Math.floor(Math.random() * 50),
            status: center?.status || 'Activo',
            ...formData,
        };
        onSave(newCenter);
    };

    const FormSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
        <div className="space-y-4 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="text-primary-600 dark:text-primary-400">{icon}</div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">{title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {children}
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <FormSection title="Identificación" icon={<IdCardIcon className="w-6 h-6" />}>
                <InputField label="ID Cliente" name="clientId" value={formData.clientId} onChange={handleChange} placeholder="CLI990149" />
                <SelectField label="Tipo de Persona" name="personType" value={formData.personType} onChange={handleChange} options={Object.values(PersonType)} />
                <SelectField label="Clasificación" name="classification" value={formData.classification} onChange={handleChange} options={Object.values(CenterClassification)} />
                <InputField label="NIF/Documento" name="taxId" value={formData.taxId} onChange={handleChange} placeholder="12345678-9" />
            </FormSection>

            <FormSection title="Contacto" icon={<PhoneIcon className="w-6 h-6" />}>
                <InputField label="Nombre/Razón Social *" name="companyName" value={formData.companyName} onChange={handleChange} required />
                <InputField label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} placeholder="+505 7654 3210" />
                <InputField label="Correo Electrónico *" name="email" value={formData.email} onChange={handleChange} type="email" required />
                <InputField label="Sitio Web" name="website" value={formData.website} onChange={handleChange} placeholder="https://empresa.com" />
            </FormSection>

            <FormSection title="Dirección" icon={<LocationMarkerIcon className="w-6 h-6" />}>
                <InputField label="País" name="country" value={formData.country} onChange={handleChange} disabled />
                <SelectField label="Ciudad" name="city" value={formData.city} onChange={handleChange} options={nicaraguanCities} />
                <div className="md:col-span-2">
                    <label htmlFor="fullAddress" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Dirección Completa</label>
                    <textarea name="fullAddress" id="fullAddress" value={formData.fullAddress} onChange={handleChange} rows={3} className="mt-1 input-field" />
                </div>
            </FormSection>
            
            <FormSection title="Ubicación Geográfica" icon={<GlobeAltIcon className="w-6 h-6" />}>
                 <InputField label="Latitud" name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Coordenada Norte/Sur (decimal)" />
                 <InputField label="Longitud" name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Coordenada Este/Oeste (decimal)" />
                 <div className="md:col-span-2">
                    <button type="button" onClick={handleGetCurrentLocation} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold">
                        Obtener Ubicación Actual
                    </button>
                    <p className="text-xs text-center text-neutral-500 mt-2">Las coordenadas se actualizan automáticamente al seleccionar una ciudad.</p>
                 </div>
            </FormSection>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 font-semibold">Cancelar</button>
                <button type="submit" className="px-6 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 font-semibold">Guardar Cliente</button>
            </div>
        </form>
    );
};

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
        <input {...props} className="mt-1 input-field" />
    </div>
);

const SelectField: React.FC<any> = ({ label, options, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
        <select {...props} className="mt-1 input-field">
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


export default CenterForm;