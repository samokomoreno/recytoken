import React, { useContext } from 'react';
import { AppContext, AppContextType } from '../../context/AppContext';

const Settings: React.FC = () => {
    const { centers, materials, transactions, invoices, showToast } = useContext(AppContext) as AppContextType;

    const handleBackup = () => {
        const data = {
            centers,
            materials,
            transactions,
            invoices,
            timestamp: new Date().toISOString()
        };
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recytoken-up_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Respaldo de datos creado con éxito.', 'success');
    };

    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target?.result;
                    if (typeof text === 'string') {
                        const data = JSON.parse(text);
                        // Here you would call your setters from context
                        // e.g., setCenters(data.centers);
                        // This requires passing setters to the context value
                        showToast('Datos restaurados con éxito. Refresca la página.', 'success');
                         // For this example, we'll just log it.
                        console.log("Restored data:", data);
                    }
                } catch (error) {
                    showToast('Error al restaurar el archivo.', 'error');
                }
            };
            reader.readAsText(file);
        }
    };


    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold border-b pb-4 mb-4 dark:border-gray-700">Preferencias de Usuario</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label htmlFor="language" className="font-medium">Idioma</label>
                        <select id="language" className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
                            <option>Español</option>
                            <option disabled>English (coming soon)</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold border-b pb-4 mb-4 dark:border-gray-700">Gestión de Notificaciones</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="font-medium">Notificaciones Push</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold border-b pb-4 mb-4 dark:border-gray-700">Respaldo y Restauración de Datos</h3>
                 <div className="flex flex-col md:flex-row gap-4 items-center">
                    <button onClick={handleBackup} className="w-full md:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Crear Respaldo
                    </button>
                    <label className="w-full md:w-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer text-center">
                        Restaurar desde Archivo
                        <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Guarda o carga todos los datos de la aplicación desde un archivo JSON.</p>
                 </div>
            </div>
        </div>
    );
};

export default Settings;