import { createContext, Dispatch, SetStateAction } from 'react';
import { Material, Center, Transaction, Invoice, Section } from '../types';

export interface AppContextType {
    materials: Material[];
    setMaterials: Dispatch<SetStateAction<Material[]>>;
    centers: Center[];
    setCenters: Dispatch<SetStateAction<Center[]>>;
    transactions: Transaction[];
    setTransactions: Dispatch<SetStateAction<Transaction[]>>;
    invoices: Invoice[];
    setInvoices: Dispatch<SetStateAction<Invoice[]>>;
    activeSection: Section;
    setActiveSection: Dispatch<SetStateAction<Section>>;
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
    marketplaceMaterialId: string | null;
    setMarketplaceMaterialId: Dispatch<SetStateAction<string | null>>;
}

export const AppContext = createContext<AppContextType | null>(null);
