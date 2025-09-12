import React from 'react';

const Analytics: React.FC = () => {
    return (
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 rounded-lg">
            <h3 className="font-bold text-yellow-800 dark:text-yellow-200">Componente Obsoleto</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Esta sección de Analíticas ha sido reemplazada por la nueva sección de Búsqueda. Este archivo puede ser eliminado.
            </p>
        </div>
    );
};

export default Analytics;