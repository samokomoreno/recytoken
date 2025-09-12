import React, { useState, useContext, useMemo } from 'react';
import { AppContext, AppContextType } from '../../context/AppContext';
import { Material, MaterialCategory, Section } from '../../types';
import Modal from '../common/Modal';
import MaterialForm from './MaterialForm';
import { SearchIcon, PlusIcon, TrashIcon } from '../common/Icons';

const MaterialCard: React.FC<{ material: Material; onEdit: () => void; onDelete: () => void; }> = ({ material, onEdit, onDelete }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div>
             <img src={material.imageUrl} alt={material.name} className="w-full h-40 object-cover rounded-t-lg" />
             <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{material.name}</h3>
                    <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">{material.category}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 h-10 overflow-hidden">{material.description}</p>
                
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 border-t pt-3 dark:border-gray-700">
                     <div className="flex justify-between"><span>Inventario:</span><span className="font-semibold">{material.inventoryKg.toLocaleString()} kg</span></div>
                     <div className="flex justify-between"><span>Precio/kg:</span><span className="font-semibold">{material.pricePerKg.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</span></div>
                     <div className="flex justify-between"><span>Ubicación:</span><span className="font-semibold">{material.location}</span></div>
                </div>
            </div>
        </div>
        <div className="p-4 pt-0 flex gap-2">
            <button onClick={onEdit} className="flex-1 bg-gray-200 dark:bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 text-sm font-semibold">Editar</button>
            <button onClick={onDelete} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md"><TrashIcon className="w-5 h-5"/></button>
        </div>
    </div>
);


const Materials: React.FC = () => {
    const { materials, setMaterials, showToast, setActiveSection, setMarketplaceMaterialId } = useContext(AppContext) as AppContextType;
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | undefined>(undefined);
    const [deletingMaterial, setDeletingMaterial] = useState<Material | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMaterials = useMemo(() => {
        return materials.filter(m =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [materials, searchTerm]);

    const handleSave = (material: Material) => {
        if (editingMaterial) {
            setMaterials(prev => prev.map(m => m.id === material.id ? material : m));
            showToast('Material actualizado con éxito', 'success');
        } else {
            setMaterials(prev => [material, ...prev]);
            showToast('Material agregado con éxito', 'success');
        }
        setIsFormModalOpen(false);
        setEditingMaterial(undefined);
    };

    const handleDelete = () => {
        if (deletingMaterial) {
            setMaterials(prev => prev.filter(m => m.id !== deletingMaterial.id));
            showToast('Material eliminado con éxito', 'info');
            setDeletingMaterial(null);
        }
    };
    
    const handleCloseModal = () => {
        setIsFormModalOpen(false);
        setEditingMaterial(undefined);
    };

    const openAddModal = () => {
        setEditingMaterial(undefined);
        setIsFormModalOpen(true);
    };

    const openEditModal = (material: Material) => {
        setEditingMaterial(material);
        setIsFormModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventario de Materiales</h2>
                    <p className="text-gray-600 dark:text-gray-400">Gestiona los materiales reciclables de tu inventario.</p>
                </div>
                 <div className="flex w-full md:w-auto items-center gap-4">
                    <div className="relative flex-grow">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                        <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <button onClick={openAddModal} className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center gap-2 whitespace-nowrap">
                        <PlusIcon className="w-5 h-5" /> Nuevo Material
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMaterials.map(material => (
                    <MaterialCard 
                        key={material.id} 
                        material={material} 
                        onEdit={() => openEditModal(material)} 
                        onDelete={() => setDeletingMaterial(material)}
                    />
                ))}
            </div>

            {isFormModalOpen && (
                <Modal isOpen={isFormModalOpen} onClose={handleCloseModal} title={editingMaterial ? 'Editar Material' : 'Nuevo Material'} size="lg">
                    <MaterialForm material={editingMaterial} onSave={handleSave} onCancel={handleCloseModal} />
                </Modal>
            )}

            {deletingMaterial && (
                <Modal isOpen={true} onClose={() => setDeletingMaterial(null)} title="Confirmar Eliminación" size="sm">
                    <div className="text-center">
                        <TrashIcon className="mx-auto h-12 w-12 text-red-600" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">¿Estás seguro?</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Quieres eliminar <span className="font-bold">{deletingMaterial.name}</span>? Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-6 flex justify-center gap-4">
                            <button onClick={() => setDeletingMaterial(null)} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600">Cancelar</button>
                            <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-600 text-white">Eliminar</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Materials;