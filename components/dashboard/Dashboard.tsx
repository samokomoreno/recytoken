import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { AppContext, AppContextType } from '../../context/AppContext';
import { Section, MaterialCategory, Material } from '../../types';
import { 
    ArrowPathIcon, 
    CubeIcon, 
    TicketIcon, 
    ClipboardDocumentListIcon, 
    ArchiveBoxIcon, 
    ShieldCheckIcon 
} from '../common/Icons';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, onClick }) => {
    const isClickable = !!onClick;
    const Tag = isClickable ? 'button' : 'div';

    return (
        <Tag
            onClick={onClick}
            className={`bg-white dark:bg-neutral-800 p-5 rounded-xl shadow-sm flex items-start w-full text-left border border-transparent ${isClickable ? 'cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800 hover:-translate-y-1' : ''}`}
        >
            <div className="flex-shrink-0 text-primary-600 dark:text-primary-400 mr-4 mt-1">
                {icon}
            </div>
            <div className="flex-grow">
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{value}</p>
            </div>
        </Tag>
    );
};

const Dashboard: React.FC = () => {
    const { materials, centers, transactions, setActiveSection } = useContext(AppContext) as AppContextType;

    // 1. Total Tokens
    const totalTokens = new Set(transactions.map(t => t.materialTokenId)).size.toLocaleString('es-NI');

    // 2. Material Activo
    const activeMaterials = materials.length.toLocaleString('es-NI');
    
    // 3. Material Recolectado (en toneladas)
    const collectedMaterialTonnes = (transactions.reduce((sum, t) => sum + t.quantityKg, 0) / 1000).toLocaleString('es-NI', { maximumFractionDigits: 2 });

    // 4. Transacciones (cantidad)
    const totalTransactions = transactions.length.toLocaleString('es-NI');

    // 5. CO2 evitado en toneladas
    const calculateCO2Saved = (): string => {
        const materialCategoryMap = new Map(materials.map(m => [m.name, m.category]));
        const co2Factors: { [key in MaterialCategory]: number } = { // Tonnes of CO2 saved per tonne of material
            [MaterialCategory.Plastic]: 1.5,
            [MaterialCategory.Paper]: 0.9,
            [MaterialCategory.Glass]: 0.3,
            [MaterialCategory.Metal]: 5.0,
            [MaterialCategory.Organic]: 0.1,
            [MaterialCategory.Electronic]: 10.0,
        };

        const totalCo2SavedKg = transactions.reduce((acc, t) => {
            const category = materialCategoryMap.get(t.materialName);
            if (category && co2Factors[category]) {
                return acc + (t.quantityKg * co2Factors[category]);
            }
            return acc;
        }, 0);
        
        return (totalCo2SavedKg / 1000).toLocaleString('es-NI', { maximumFractionDigits: 2 });
    };
    const co2SavedTonnes = calculateCO2Saved();

    // 6. Centros Activos
    const activeCenters = centers.filter(c => c.status === 'Activo').length.toString();

    const chartData = centers.slice(0, 5).map(center => ({
        name: center.city,
        Procesado: center.processedMaterials
    }));

    const lineChartData = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6-i));
        const dateStr = d.toISOString().split('T')[0];
        return {
            name: d.toLocaleDateString('es-NI', {weekday: 'short'}),
            Transacciones: transactions.filter(t => t.date.startsWith(dateStr)).length,
        }
    });

    const categoryData = materials.reduce((acc: Record<string, number>, material: Material) => {
        const category = material.category;
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += material.inventoryKg;
        return acc;
    }, {});

    const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
    const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#dcfce7'];

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <StatCard title="Total Tokens" value={totalTokens} icon={<TicketIcon />} onClick={() => setActiveSection(Section.Billing)} />
                <StatCard title="Material Activo" value={activeMaterials} icon={<ClipboardDocumentListIcon />} onClick={() => setActiveSection(Section.Materials)} />
                <StatCard title="Material Recolectado (Tn)" value={collectedMaterialTonnes} icon={<ArchiveBoxIcon />} onClick={() => setActiveSection(Section.Materials)} />
                <StatCard title="Transacciones" value={totalTransactions} icon={<CubeIcon />} onClick={() => setActiveSection(Section.Traceability)} />
                <StatCard title="CO2 Evitado (Tn)" value={co2SavedTonnes} icon={<ShieldCheckIcon />} />
                <StatCard title="Centros Activos" value={activeCenters} icon={<ArrowPathIcon />} onClick={() => setActiveSection(Section.Centers)} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Materiales Procesados por Centro (Top 5)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                            <XAxis dataKey="name" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none' }} />
                            <Legend />
                            <Bar dataKey="Procesado" fill="#16a34a" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
                     <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Distribución por Categoría</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={(entry) => entry.name}>
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                             <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-3 bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Actividad Reciente</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {transactions.slice(0, 10).map(t => (
                            <div key={t.id} className="flex items-center space-x-4">
                               <div className="p-2 bg-neutral-100 dark:bg-neutral-700 rounded-full">
                                   <CubeIcon />
                               </div>
                               <div>
                                   <p className="font-medium text-sm">{t.materialName} ({t.quantityKg} kg)</p>
                                   <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.centerName} - <span className="font-semibold">{t.status}</span></p>
                               </div>
                               <p className="text-xs text-neutral-400 dark:text-neutral-500 ml-auto">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
                 {/* Line Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-4 text-neutral-900 dark:text-white">Transacciones (Últimos 7 días)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={lineChartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                            <XAxis dataKey="name" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip />
                            <Line type="monotone" dataKey="Transacciones" stroke="#16a34a" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;