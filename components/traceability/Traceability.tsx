import React, { useState, useContext, useMemo } from 'react';
import { AppContext, AppContextType } from '../../context/AppContext';
import { Transaction, TransactionStatus } from '../../types';
import { QrCodeIcon, SearchIcon, CubeIcon, ArchiveBoxIcon, ArrowPathIcon, ShieldCheckIcon, BanknotesIcon } from '../common/Icons';

const statusStyles = {
    [TransactionStatus.Collected]: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', border: 'border-blue-500' },
    [TransactionStatus.Processing]: { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', border: 'border-yellow-500' },
    [TransactionStatus.Processed]: { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200', border: 'border-purple-500' },
    [TransactionStatus.Sold]: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', border: 'border-green-500' },
};

const statusIcons: { [key in TransactionStatus]: React.ReactNode } = {
    [TransactionStatus.Collected]: <ArchiveBoxIcon className="w-4 h-4" />,
    [TransactionStatus.Processing]: <ArrowPathIcon className="w-4 h-4" />,
    [TransactionStatus.Processed]: <ShieldCheckIcon className="w-4 h-4" />,
    [TransactionStatus.Sold]: <BanknotesIcon className="w-4 h-4" />,
};


const Traceability: React.FC = () => {
    const { transactions } = useContext(AppContext) as AppContextType;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => 
            t.materialTokenId.toLowerCase().includes(searchTerm.toLowerCase()) || 
            t.materialName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [transactions, searchTerm]);
    
    const selectedMaterialHistory = useMemo(() => {
        if (!selectedTransaction) return [];
        return transactions
            .filter(t => t.materialTokenId === selectedTransaction.materialTokenId)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [transactions, selectedTransaction]);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="relative flex-grow max-w-lg">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon />
                    </span>
                    <input 
                        type="text" 
                        placeholder="Buscar por Token ID o nombre de material..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 overflow-y-auto max-h-[70vh] bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-4 text-lg">Transacciones</h3>
                    <div className="space-y-2">
                        {filteredTransactions.map(t => (
                            <button key={t.id} onClick={() => setSelectedTransaction(t)} className={`w-full text-left p-3 rounded-md ${selectedTransaction?.id === t.id ? 'bg-primary-100 dark:bg-primary-900/50' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                                <p className="font-bold text-sm">{t.materialName}</p>
                                <p className="text-xs text-gray-500 truncate">{t.materialTokenId}</p>
                                <p className="text-xs text-gray-400">{new Date(t.date).toLocaleString()}</p>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    {selectedTransaction ? (
                        <div>
                             <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">{selectedTransaction.materialName}</h2>
                                    <p className="text-sm font-mono text-gray-500 dark:text-gray-400 break-all">{selectedTransaction.materialTokenId}</p>
                                </div>
                                <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <QrCodeIcon className="w-8 h-8"/>
                                </button>
                            </div>
                            <div className="mt-6">
                                <h3 className="font-semibold text-lg mb-4">Historial del Token</h3>
                                <div className="relative border-l-2 border-primary-500 ml-3">
                                    {selectedMaterialHistory.map((item) => (
                                        <div key={item.id} className="mb-8 ml-6">
                                            <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white dark:ring-gray-800 ${statusStyles[item.status].bg} ${statusStyles[item.status].text}`}>
                                                {statusIcons[item.status]}
                                            </span>
                                            <div className={`p-4 rounded-lg border-l-4 ${statusStyles[item.status].border} ${statusStyles[item.status].bg}`}>
                                                <div className="flex justify-between items-center">
                                                    <span className={`text-sm font-semibold px-2.5 py-0.5 rounded ${statusStyles[item.status].bg} ${statusStyles[item.status].text}`}>
                                                        {item.status}
                                                    </span>
                                                    <time className="text-xs font-normal text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleString('es-NI')}</time>
                                                </div>
                                                <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                                                    <span className="font-bold">{item.quantityKg} kg</span> transferidos desde <span className="font-bold">{item.centerName}</span>.
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                           <CubeIcon className="w-16 h-16 mb-4"/>
                           <h3 className="text-xl font-semibold">Selecciona una transacción</h3>
                           <p>Elige una transacción de la lista para ver su historial de trazabilidad.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Traceability;