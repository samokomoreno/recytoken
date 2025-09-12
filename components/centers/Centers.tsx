import React, { useState, useContext, useMemo } from 'react';
import { AppContext, AppContextType } from '../../context/AppContext';
import { Center, CenterClassification } from '../../types';
import Modal from '../common/Modal';
import CenterForm from './CenterForm';
import { SearchIcon, PlusIcon, MailIcon, PhoneIcon, LocationMarkerIcon, BuildingOfficeIcon, GlobeAltIcon, StarIcon, TrashIcon } from '../common/Icons';

const Rating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(rating)} />)}
    </div>
);

const CenterCard: React.FC<{ center: Center; onEdit: () => void; onDelete: () => void; }> = ({ center, onEdit, onDelete }) => {
    const classificationStyles = {
        [CenterClassification.Cliente]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        [CenterClassification.Proveedor]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{center.companyName}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{center.clientId}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${classificationStyles[center.classification]}`}>
                        {center.classification}
                    </span>
                </div>
                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-3"><MailIcon className="w-5 h-5 text-gray-400" /><span>{center.email}</span></div>
                    <div className="flex items-center gap-3"><PhoneIcon className="w-5 h-5 text-gray-400" /><span>{center.phone}</span></div>
                    <div className="flex items-center gap-3"><LocationMarkerIcon className="w-5 h-5 text-gray-400" /><span>{center.city}, {center.country}</span></div>
                    <div className="flex items-center gap-3"><BuildingOfficeIcon className="w-5 h-5 text-gray-400" /><span>{center.fullAddress}</span></div>
                    <div className="flex items-center gap-3"><GlobeAltIcon className="w-5 h-5 text-gray-400" /><span>{center.latitude}, {center.longitude}</span></div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <Rating rating={center.rating} />
                    <span className="text-sm text-gray-500 dark:text-gray-400">({center.rating.toFixed(1)})</span>
                </div>
            </div>
            <div className="mt-6 flex gap-3">
                <button onClick={onEdit} className="w-full bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors font-semibold">Editar</button>
                <button onClick={onDelete} className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-semibold">Eliminar</button>
            </div>
        </div>
    );
};

const Centers: React.FC = () => {
    const { centers, setCenters, showToast } = useContext(AppContext) as AppContextType;
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingCenter, setEditingCenter] = useState<Center | undefined>(undefined);
    const [deletingCenter, setDeletingCenter] = useState<Center | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCenters = useMemo(() => {
        return centers.filter(c =>
            c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.clientId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [centers, searchTerm]);

    const handleSave = (center: Center) => {
        if (editingCenter) {
            setCenters(prev => prev.map(c => c.id === center.id ? center : c));
            showToast('Centro actualizado con éxito', 'success');
        } else {
            setCenters(prev => [...prev, center]);
            showToast('Centro agregado con éxito', 'success');
        }
        setIsFormModalOpen(false);
        setEditingCenter(undefined);
    };

    const handleDelete = () => {
        if (deletingCenter) {
            setCenters(prev => prev.filter(c => c.id !== deletingCenter.id));
            showToast('Centro eliminado con éxito', 'info');
            setDeletingCenter(null);
        }
    };
    
    const handleCloseModal = () => {
        setIsFormModalOpen(false);
        setEditingCenter(undefined);
    };

    const openAddModal = () => {
        setEditingCenter(undefined);
        setIsFormModalOpen(true);
    };

    const openEditModal = (center: Center) => {
        setEditingCenter(center);
        setIsFormModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Centros de Acopio / Empresas</h2>
                    <p className="text-gray-600 dark:text-gray-400">Gestiona tu red de centros de acopio y empresas</p>
                </div>
                 <div className="flex w-full md:w-auto items-center gap-4">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon />
                        </span>
                        <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <button onClick={openAddModal} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2 whitespace-nowrap">
                        <PlusIcon className="w-5 h-5" /> Nuevo Centro
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCenters.map(center => (
                    <CenterCard 
                        key={center.id} 
                        center={center} 
                        onEdit={() => openEditModal(center)} 
                        onDelete={() => setDeletingCenter(center)}
                    />
                ))}
            </div>

            {isFormModalOpen && (
                <Modal isOpen={isFormModalOpen} onClose={handleCloseModal} title={editingCenter ? 'Editar Centro de Acopio / Empresa' : 'Nuevo Centro de Acopio / Empresa'} size="xl">
                    <CenterForm center={editingCenter} onSave={handleSave} onCancel={handleCloseModal} />
                </Modal>
            )}

            {deletingCenter && (
                <Modal isOpen={true} onClose={() => setDeletingCenter(null)} title="Confirmar Eliminación" size="sm">
                    <div className="text-center">
                        <TrashIcon className="mx-auto h-12 w-12 text-red-600" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">¿Estás seguro?</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Quieres eliminar a <span className="font-bold">{deletingCenter.companyName}</span>? Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-6 flex justify-center gap-4">
                            <button onClick={() => setDeletingCenter(null)} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600">Cancelar</button>
                            <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-600 text-white">Eliminar</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Centers;