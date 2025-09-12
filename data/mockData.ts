import { Material, MaterialCategory, Center, Transaction, Invoice, PersonType, CenterClassification, TransactionStatus, InvoiceStatus } from '../types';

const generateSvgPlaceholder = (category: MaterialCategory): string => {
    const colors: Record<MaterialCategory, { bg: string, wave1: string, wave2: string }> = {
        [MaterialCategory.Plastic]: { bg: '#eff6ff', wave1: '#60a5fa', wave2: '#3b82f6' }, // blue
        [MaterialCategory.Paper]: { bg: '#fff7ed', wave1: '#fb923c', wave2: '#f97316' }, // orange
        [MaterialCategory.Glass]: { bg: '#f0fdfa', wave1: '#5eead4', wave2: '#14b8a6' }, // teal
        [MaterialCategory.Metal]: { bg: '#f1f5f9', wave1: '#94a3b8', wave2: '#64748b' }, // slate
        [MaterialCategory.Organic]: { bg: '#f7fee7', wave1: '#a3e635', wave2: '#84cc16' }, // lime
        [MaterialCategory.Electronic]: { bg: '#eef2ff', wave1: '#818cf8', wave2: '#6366f1' }, // indigo
    };
    const { bg, wave1, wave2 } = colors[category];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${bg}"/>
        <path d="M -10 20 C 30 50, 70 0, 110 30 L 110 110 L -10 110 Z" fill="${wave1}" opacity="0.6"/>
        <path d="M -10 40 C 30 70, 70 20, 110 50 L 110 110 L -10 110 Z" fill="${wave2}" opacity="0.6"/>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
};


export const mockMaterials: Material[] = [
    { id: 'M001', name: 'Botellas PET', description: 'Plástico PET transparente de botellas de bebidas.', category: MaterialCategory.Plastic, subcategory: 'PET', inventoryKg: 1200, pricePerKg: 15, location: 'Managua', quality: 'Grado A', tokenId: 'TKN-PET-001X', walletAddress: '0x1A...a2B', imageUrl: generateSvgPlaceholder(MaterialCategory.Plastic) },
    { id: 'M002', name: 'Cartón Corrugado', description: 'Cajas de cartón de embalaje.', category: MaterialCategory.Paper, subcategory: 'Cartón', inventoryKg: 3500, pricePerKg: 8, location: 'León', quality: 'Grado B', tokenId: 'TKN-PAP-002Y', walletAddress: '0x2B...b3C', imageUrl: generateSvgPlaceholder(MaterialCategory.Paper) },
    { id: 'M003', name: 'Vidrio Ámbar', description: 'Botellas de vidrio color ámbar, principalmente de cerveza.', category: MaterialCategory.Glass, subcategory: 'Ámbar', inventoryKg: 850, pricePerKg: 5, location: 'Managua', quality: 'Grado A', tokenId: 'TKN-GLS-003Z', walletAddress: '0x3C...c4D', imageUrl: generateSvgPlaceholder(MaterialCategory.Glass) },
    { id: 'M004', name: 'Latas de Aluminio', description: 'Latas de bebidas de aluminio.', category: MaterialCategory.Metal, subcategory: 'Aluminio', inventoryKg: 500, pricePerKg: 40, location: 'Granada', quality: 'Grado A', tokenId: 'TKN-MET-004A', walletAddress: '0x4D...d5E', imageUrl: generateSvgPlaceholder(MaterialCategory.Metal) },
    { id: 'M005', name: 'Residuos Orgánicos', description: 'Composta de residuos de alimentos y jardín.', category: MaterialCategory.Organic, subcategory: 'Compostables', inventoryKg: 5000, pricePerKg: 2, location: 'Masaya', quality: 'N/A', tokenId: 'TKN-ORG-005B', walletAddress: '0x5E...e6F', imageUrl: generateSvgPlaceholder(MaterialCategory.Organic) },
    { id: 'M006', name: 'Placas de Circuito', description: 'Placas base de computadoras y otros electrónicos.', category: MaterialCategory.Electronic, subcategory: 'Placas Base', inventoryKg: 150, pricePerKg: 150, location: 'Managua', quality: 'Mixta', tokenId: 'TKN-ELE-006C', walletAddress: '0x6F...f7G', imageUrl: generateSvgPlaceholder(MaterialCategory.Electronic) },
    { id: 'M007', name: 'Papel de Oficina', description: 'Papel bond blanco, usado.', category: MaterialCategory.Paper, subcategory: 'Oficina', inventoryKg: 900, pricePerKg: 9, location: 'León', quality: 'Grado A', tokenId: 'TKN-PAP-007D', walletAddress: '0x7G...g8H', imageUrl: generateSvgPlaceholder(MaterialCategory.Paper) },
];

export const mockCenters: Center[] = [
    { id: 'C01', clientId: 'CLI1001', companyName: 'Recicladora del Norte S.A.', personType: PersonType.Juridica, classification: CenterClassification.Proveedor, taxId: 'J0310000123456', phone: '+505 2278 1234', email: 'contacto@recinorte.com.ni', website: 'https://recinorte.com.ni', country: 'Nicaragua', city: 'Managua', fullAddress: 'Km 8 Carretera Norte', latitude: '12.1645', longitude: '-86.2712', processedMaterials: 15000, rating: 4.5, reviews: 34, status: 'Activo' },
    { id: 'C02', clientId: 'CLI1002', companyName: 'Vidrios y Plásticos de León', personType: PersonType.Juridica, classification: CenterClassification.Cliente, taxId: 'J0310000654321', phone: '+505 2311 5678', email: 'ventas@vipleon.com', website: 'https://vipleon.com', country: 'Nicaragua', city: 'León', fullAddress: 'Zona Franca, Lote 12', latitude: '12.4352', longitude: '-86.8810', processedMaterials: 8000, rating: 4.2, reviews: 21, status: 'Activo' },
    { id: 'C03', clientId: 'CLI1003', companyName: 'Comercial Granada Verde', personType: PersonType.Natural, classification: CenterClassification.Proveedor, taxId: '201-100580-0001A', phone: '+505 8888 9999', email: 'verdegranada@gmail.com', website: '', country: 'Nicaragua', city: 'Granada', fullAddress: 'Calle La Calzada, de la iglesia 2c al lago', latitude: '11.9298', longitude: '-85.9520', processedMaterials: 5500, rating: 4.8, reviews: 45, status: 'Activo' },
    { id: 'C04', clientId: 'CLI1004', companyName: 'Centro de Acopio Masaya', personType: PersonType.Natural, classification: CenterClassification.Proveedor, taxId: '441-251275-0002B', phone: '+505 8765 4321', email: 'acopio.masaya@yahoo.com', website: '', country: 'Nicaragua', city: 'Masaya', fullAddress: 'Del mercado de artesanías 1c arriba', latitude: '11.9744', longitude: '-86.0984', processedMaterials: 12000, rating: 4.0, reviews: 15, status: 'Activo' },
];

export const mockTransactions: Transaction[] = [
    { id: 'T001', materialTokenId: 'TKN-PET-001X', materialName: 'Botellas PET', quantityKg: 250, date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), centerName: 'Recicladora del Norte S.A.', status: TransactionStatus.Processed },
    { id: 'T002', materialTokenId: 'TKN-PAP-002Y', materialName: 'Cartón Corrugado', quantityKg: 1200, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), centerName: 'Vidrios y Plásticos de León', status: TransactionStatus.Processing },
    { id: 'T003', materialTokenId: 'TKN-PET-001X', materialName: 'Botellas PET', quantityKg: 500, date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), centerName: 'Comercial Granada Verde', status: TransactionStatus.Collected },
    { id: 'T004', materialTokenId: 'TKN-MET-004A', materialName: 'Latas de Aluminio', quantityKg: 100, date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), centerName: 'Recicladora del Norte S.A.', status: TransactionStatus.Sold },
    { id: 'T005', materialTokenId: 'TKN-GLS-003Z', materialName: 'Vidrio Ámbar', quantityKg: 300, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), centerName: 'Centro de Acopio Masaya', status: TransactionStatus.Processed },
];

export const mockInvoices: Invoice[] = [
    { id: 'INV001', invoiceNumber: 'FAC-2024-001', centerName: 'Vidrios y Plásticos de León', issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), items: [{ materialName: 'Cartón Corrugado', quantityKg: 1200, pricePerKg: 8, total: 9600 }], subtotal: 9600, tax: 1440, total: 11040, status: InvoiceStatus.Paid },
    { id: 'INV002', invoiceNumber: 'FAC-2024-002', centerName: 'Recicladora del Norte S.A.', issueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), items: [{ materialName: 'Botellas PET', quantityKg: 250, pricePerKg: 15, total: 3750 }], subtotal: 3750, tax: 562.5, total: 4312.5, status: InvoiceStatus.Pending },
    { id: 'INV003', invoiceNumber: 'FAC-2024-003', centerName: 'Comercial Granada Verde', issueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), items: [{ materialName: 'Latas de Aluminio', quantityKg: 50, pricePerKg: 40, total: 2000 }], subtotal: 2000, tax: 300, total: 2300, status: InvoiceStatus.Overdue },
];