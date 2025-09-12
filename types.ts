export enum Section {
    Dashboard = 'Dashboard',
    Materials = 'Inventario',
    Centers = 'Centros',
    Traceability = 'Trazabilidad',
    Marketplace = 'Marketplace',
    Billing = 'Facturación',
    Search = 'Búsqueda',
    Settings = 'Configuración',
}

export enum MaterialCategory {
    Plastic = 'Plástico',
    Paper = 'Papel y Cartón',
    Glass = 'Vidrio',
    Metal = 'Metales',
    Organic = 'Orgánico',
    Electronic = 'Electrónicos',
}

export interface Material {
    id: string;
    name: string;
    description: string;
    category: MaterialCategory;
    subcategory: string;
    inventoryKg: number;
    pricePerKg: number; // in NIO
    location: string; // City
    quality: string; // e.g., 'Grado A', 'Grado B'
    tokenId: string; // Blockchain token ID
    walletAddress: string;
    imageUrl?: string; // Optional image URL (base64)
}

export enum PersonType {
    Natural = 'Persona Natural',
    Juridica = 'Persona Jurídica',
}

export enum CenterClassification {
    Cliente = 'Cliente',
    Proveedor = 'Proveedor',
}

export enum CenterStatus {
    Active = 'Activo',
    Inactive = 'Inactivo',
}

export interface Center {
    id: string;
    clientId: string;
    companyName: string;
    personType: PersonType;
    classification: CenterClassification;
    taxId: string; // NIF/RUC
    phone: string;
    email: string;
    website: string;
    country: string;
    city: string;
    fullAddress: string;
    latitude: string;
    longitude: string;
    processedMaterials: number; // in Kg
    rating: number; // 1 to 5
    reviews: number;
    status: 'Activo' | 'Inactivo';
}

export enum TransactionStatus {
    Collected = 'Recolectado',
    Processing = 'En Proceso',
    Processed = 'Procesado',
    Sold = 'Vendido',
}

export interface Transaction {
    id: string;
    materialTokenId: string;
    materialName: string;
    quantityKg: number;
    date: string; // ISO string
    centerName: string;
    status: TransactionStatus;
}

export enum InvoiceStatus {
    Paid = 'Pagada',
    Pending = 'Pendiente',
    Overdue = 'Vencida',
}

export interface InvoiceItem {
    materialName: string;
    quantityKg: number;
    pricePerKg: number;
    total: number;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    centerName: string;
    issueDate: string; // ISO string
    dueDate: string; // ISO string
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: InvoiceStatus;
}