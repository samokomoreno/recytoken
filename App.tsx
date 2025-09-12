import React, { useState, Dispatch, SetStateAction, useEffect, lazy, Suspense } from 'react';

import { Section, Material, Center, Transaction, Invoice } from './types';
import { mockMaterials, mockCenters, mockTransactions, mockInvoices } from './data/mockData';
import useLocalStorage from './hooks/useLocalStorage';
import { AppContext, AppContextType } from './context/AppContext';

import Login from './components/login/Login';
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Materials = lazy(() => import('./components/materials/Materials'));
const Centers = lazy(() => import('./components/centers/Centers'));
const Traceability = lazy(() => import('./components/traceability/Traceability'));
const Marketplace = lazy(() => import('./components/marketplace/Marketplace'));
const Billing = lazy(() => import('./components/billing/Billing'));
const Search = lazy(() => import('./components/search/Search'));
const Settings = lazy(() => import('./components/settings/Settings'));

import { 
    DashboardIcon, 
    InventoryIcon,
    CollectionCenterIcon, 
    TraceabilityIcon, 
    MarketplaceIcon, 
    BillingIcon, 
    MapIcon, 
    SettingsIcon,
    LogoutIcon,
    LogoIcon,
    SunIcon,
    MoonIcon,
    MenuIcon,
    CloseIcon
} from './components/common/Icons';

const sectionComponents: { [key in Section]: React.LazyExoticComponent<React.ComponentType<{}>> } = {
    [Section.Dashboard]: Dashboard,
    [Section.Materials]: Materials,
    [Section.Centers]: Centers,
    [Section.Traceability]: Traceability,
    [Section.Marketplace]: Marketplace,
    [Section.Search]: Search,
    [Section.Billing]: Billing,
    [Section.Settings]: Settings,
};

const navItems = [
    { section: Section.Dashboard, icon: <DashboardIcon /> },
    { section: Section.Materials, icon: <InventoryIcon /> },
    { section: Section.Centers, icon: <CollectionCenterIcon /> },
    { section: Section.Traceability, icon: <TraceabilityIcon /> },
    { section: Section.Marketplace, icon: <MarketplaceIcon /> },
    { section: Section.Search, icon: <MapIcon /> },
    { section: Section.Billing, icon: <BillingIcon /> },
    { section: Section.Settings, icon: <SettingsIcon /> },
];

const Toast: React.FC<{ message: string; type: string; onClose: () => void }> = ({ message, type, onClose }) => {
    const baseClasses = 'fixed top-5 right-5 z-50 p-4 rounded-lg shadow-lg text-white flex items-center animate-fade-in-down';
    const typeClasses = {
        success: 'bg-primary-600',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };
    
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`${baseClasses} ${typeClasses[type as keyof typeof typeClasses]}`}>
            {message}
             {/* FIX: Removed non-standard 'jsx' attribute from style tag. */}
             <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);
    const [theme, setTheme] = useLocalStorage('theme', 'light');

    const [materials, setMaterials] = useLocalStorage<Material[]>('materials', mockMaterials);
    const [centers, setCenters] = useLocalStorage<Center[]>('centers', mockCenters);
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', mockTransactions);
    const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', mockInvoices);
    const [activeSection, setActiveSection] = useLocalStorage<Section>('activeSection', Section.Dashboard);
    const [marketplaceMaterialId, setMarketplaceMaterialId] = useState<string | null>(null);


    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
    };

    const handleLogin = () => setIsLoggedIn(true);
    const handleLogout = () => setIsLoggedIn(false);
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    const ActiveComponent = sectionComponents[activeSection];

    return (
        <AppContext.Provider value={{
            materials, setMaterials,
            centers, setCenters,
            transactions, setTransactions,
            invoices, setInvoices,
            activeSection, setActiveSection,
            showToast,
            marketplaceMaterialId, setMarketplaceMaterialId
        }}>
            <div className="relative min-h-screen text-neutral-800 dark:text-neutral-200">
                
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-hidden="true"
                    ></div>
                )}

                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} role="navigation">
                    <div className="flex items-center justify-between h-20 border-b border-neutral-200 dark:border-neutral-700 px-4">
                        <div className="flex items-center">
                        <img  src="/images/logo.png"  alt="Recytoken Logo"  className="mx-auto h-10 w-10"/>
                            <span className="ml-2 text-xl font-bold">RECYTOKEN-UP</span>
                        </div>
                         <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700">
                            <CloseIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {navItems.map(item => (
                            <button
                                key={item.section}
                                onClick={() => {
                                    setActiveSection(item.section)
                                    setIsSidebarOpen(false);
                                }}
                                className={`flex items-center w-full px-4 py-2.5 rounded-lg transition-colors duration-200 relative ${
                                    activeSection === item.section
                                        ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300'
                                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                                }`}
                            >
                                {activeSection === item.section && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary-600 rounded-r-full"></span>}
                                {React.cloneElement(item.icon, { className: 'h-6 w-6' })}
                                <span className="ml-4 font-semibold">{item.section}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
                         <button onClick={handleLogout} className="flex items-center w-full px-4 py-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300">
                            <LogoutIcon />
                            <span className="ml-4 font-semibold">Cerrar Sesión</span>
                        </button>
                    </div>
                </aside>
                
                {/* Main Content */}
                <div className="md:ml-64 flex-1 flex flex-col">
                    <header className="flex justify-between items-center h-20 px-6 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center">
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-full md:hidden hover:bg-neutral-100 dark:hover:bg-neutral-700 mr-2">
                                <MenuIcon className="h-6 w-6" />
                            </button>
                            <h1 className="text-xl md:text-2xl font-bold">{activeSection}</h1>
                        </div>
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700">
                            {theme === 'light' ? <MoonIcon className="h-6 w-6"/> : <SunIcon className="h-6 w-6" />}
                        </button>
                    </header>
                    <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                        <Suspense fallback={<div className="text-center p-8">Cargando...</div>}>
                            <ActiveComponent />
                        </Suspense>
                    </main>
                </div>
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AppContext.Provider>
    );
};

export default App;