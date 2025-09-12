import React, { useState, useEffect } from 'react';
import { Material, MaterialCategory } from '../../types';
// FIX: Imported ArchiveBoxIcon to resolve 'Cannot find name' error.
import { BlockchainIcon, RecycleIcon, ArchiveBoxIcon } from '../common/Icons';

interface MaterialFormProps {
    material?: Material;
    onSave: (material: Material) => void;
    onCancel: () => void;
}

const nicaraguanCities = [
    "Managua", "León", "Granada", "Masaya", "Chinandega", "Matagalpa", "Estelí",
    "Jinotega", "Nueva Segovia", "Madriz", "Boaco", "Chontales", "Río San Juan",
    "RACCS", "RACCN"
];

const subcategories: Record<MaterialCategory, string[]> = {
    [MaterialCategory.Plastic]: ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'Otros'],
    [MaterialCategory.Paper]: ['Cartón', 'Periódico', 'Oficina', 'Revistas', 'Libros'],
    [MaterialCategory.Glass]: ['Transparente', 'Ámbar', 'Verde', 'Azul'],
    [MaterialCategory.Metal]: ['Aluminio', 'Hierro', 'Cobre', 'Bronce', 'Acero'],
    [MaterialCategory.Organic]: ['Compostables', 'Aceites', 'Residuos de Jardín'],
    [MaterialCategory.Electronic]: ['Computadoras', 'Teléfonos', 'Baterías', 'Cables'],
};

const MaterialForm: React.FC<MaterialFormProps> = ({ material, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Material, 'id'>>({
        name: '',
        category: MaterialCategory.Plastic,
        subcategory: 'PET',
        description: '',
        pricePerKg: 1.5,
        inventoryKg: 50,
        quality: 'Grado A',
        tokenId: '',
        walletAddress: '',
        location: 'Managua',
        imageUrl: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (material) {
            setFormData({
                name: material.name,
                category: material.category,
                subcategory: material.subcategory,
                description: material.description,
                pricePerKg: material.pricePerKg,
                inventoryKg: material.inventoryKg,
                quality: material.quality,
                tokenId: material.tokenId,
                walletAddress: material.walletAddress,
                location: material.location,
                imageUrl: material.imageUrl,
            });
            if (material.imageUrl) {
                setImagePreview(material.imageUrl);
            }
        } else {
            // Generate initial blockchain data for new materials
            const newId = `TKN${Math.floor(Math.random() * 900000) + 100000}`;
            const newWallet = `0x${[...Array(10)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}...`;
            setFormData(prev => ({ 
                ...prev, 
                tokenId: newId, 
                walletAddress: newWallet,
                subcategory: subcategories[prev.category][0],
            }));
        }
    }, [material]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, imageUrl: base64String }));
                setImagePreview(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'category') {
                newState.subcategory = subcategories[value as MaterialCategory][0];
            }
            return newState;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newMaterial: Material = {
            id: material?.id || `M${Date.now()}`,
            ...formData,
            pricePerKg: Number(formData.pricePerKg),
            inventoryKg: Number(formData.inventoryKg),
        };
        onSave(newMaterial);
    };

    const FormSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string; }> = ({ title, icon, children, className = '' }) => (
        <div className={`space-y-4 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 ${className}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className="text-primary-600 dark:text-primary-400">{icon}</div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">{title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {children}
            </div>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormSection title="Blockchain" icon={<BlockchainIcon className="w-6 h-6" />} className="bg-green-50/50 dark:bg-green-900/10">
                <InputField label="Token ID" name="tokenId" value={formData.tokenId} readOnly />
                <InputField label="Wallet Address" name="walletAddress" value={formData.walletAddress} readOnly />
            </FormSection>
            
            <FormSection title="Datos del Material" icon={<RecycleIcon className="w-6 h-6" />}>
                <InputField label="Nombre del Material *" name="name" value={formData.name} onChange={handleChange} required />
                <SelectField label="Categoría *" name="category" value={formData.category} onChange={handleChange} options={Object.values(MaterialCategory)} required/>
                <SelectField label="Subcategoría" name="subcategory" value={formData.subcategory} onChange={handleChange} options={subcategories[formData.category]} />
                <SelectField label="Calidad" name="quality" value={formData.quality} onChange={handleChange} options={['Grado A', 'Grado B', 'Grado C', 'Mixta', 'N/A']} />
                <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Descripción</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 input-field" />
                </div>
            </FormSection>

            <FormSection title="Inventario y Mercado" icon={<ArchiveBoxIcon className="w-6 h-6" />}>
                 <InputField label="Inventario (kg) *" name="inventoryKg" value={formData.inventoryKg} onChange={handleChange} type="number" required />
                 <InputField label="Precio por kg (NIO)" name="pricePerKg" value={formData.pricePerKg} onChange={handleChange} type="number" step="0.01" />
                 <SelectField label="Ubicación" name="location" value={formData.location} onChange={handleChange} options={nicaraguanCities} />
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Foto del Material</label>
                    <div className="mt-2 flex items-center gap-4">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Vista previa" className="w-24 h-24 rounded-md object-cover" />
                        ) : (
                            <div className="w-24 h-24 rounded-md bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-neutral-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                        )}
                        <label htmlFor="image-upload" className="cursor-pointer bg-white dark:bg-neutral-700 py-2 px-3 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800">
                            <span>{imagePreview ? 'Cambiar' : 'Subir'} imagen</span>
                            <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>
                </div>
            </FormSection>

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="px-6 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 font-semibold">Cancelar</button>
                <button type="submit" className="px-6 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 font-semibold">Guardar Material</button>
            </div>
        </form>
    );
};

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{label}</label>
        <input {...props} className="input-field" />
    </div>
);

const SelectField: React.FC<any> = ({ label, options, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{label}</label>
        <select {...props} className="input-field">
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);


export default MaterialForm;