import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext, AppContextType } from '../../context/AppContext';
import { Material, Center, MaterialCategory, TransactionStatus } from '../../types';
import Modal from '../common/Modal';
import { 
    CreditCardIcon, 
    BanknotesIcon, 
    BlockchainIcon, 
    PrinterIcon, 
    MailIcon, 
    PhoneIcon, 
    LocationMarkerIcon,
    CubeIcon,
    ArchiveBoxIcon,
    ClipboardDocumentListIcon,
    RecycleIcon
} from '../common/Icons';

// A simple map for category colors and icons, could be more elaborate
const categoryStyles: { [key in MaterialCategory]: { color: string, icon: React.ReactNode } } = {
    [MaterialCategory.Plastic]: { color: 'blue', icon: <CubeIcon className="w-16 h-16 text-blue-400" /> },
    [MaterialCategory.Paper]: { color: 'orange', icon: <ArchiveBoxIcon className="w-16 h-16 text-orange-400" /> },
    [MaterialCategory.Glass]: { color: 'cyan', icon: <CubeIcon className="w-16 h-16 text-cyan-400" /> },
    [MaterialCategory.Metal]: { color: 'gray', icon: <CubeIcon className="w-16 h-16 text-gray-400" /> },
    [MaterialCategory.Organic]: { color: 'lime', icon: <RecycleIcon className="w-16 h-16 text-lime-400" /> },
    [MaterialCategory.Electronic]: { color: 'indigo', icon: <ClipboardDocumentListIcon className="w-16 h-16 text-indigo-400" /> },
};

const Marketplace: React.FC = () => {
    const { materials, setMaterials, centers, transactions, setTransactions, showToast, marketplaceMaterialId, setMarketplaceMaterialId } = useContext(AppContext) as AppContextType;
    
    const [filters, setFilters] = useState({ category: 'Todas las categorías', maxPrice: '', location: 'Todas las ubicaciones' });
    const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
    const [isCheckoutVisible, setCheckoutVisible] = useState(false);
    const [isSellerInfoVisible, setSellerInfoVisible] = useState(false);

    const locations = useMemo(() => ['Todas las ubicaciones', ...Array.from(new Set(materials.map(m => m.location)))], [materials]);
    // FIX: Explicitly type the 'categories' array as string[] to resolve TypeScript errors with map keys.
    const categories: string[] = useMemo(() => ['Todas las categorías', ...Object.values(MaterialCategory)], []);
    
    const filteredMaterials = useMemo(() => {
        return materials.filter(m => {
            const categoryMatch = filters.category === 'Todas las categorías' || m.category === filters.category;
            const priceMatch = filters.maxPrice === '' || m.pricePerKg <= parseFloat(filters.maxPrice);
            const locationMatch = filters.location === 'Todas las ubicaciones' || m.location === filters.location;
            return categoryMatch && priceMatch && locationMatch;
        });
    }, [materials, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleBuyClick = (material: Material) => {
        setSelectedMaterial(material);
        setCheckoutVisible(true);
    };
    
    const handleSellerInfoClick = (material: Material) => {
        setSelectedMaterial(material);
        setSellerInfoVisible(true);
    }

    useEffect(() => {
        if (marketplaceMaterialId) {
            const materialToBuy = materials.find(m => m.id === marketplaceMaterialId);
            if (materialToBuy) {
                handleBuyClick(materialToBuy);
            }
            // Reset the ID after opening the modal
            setMarketplaceMaterialId(null);
        }
    }, [marketplaceMaterialId, materials, setMarketplaceMaterialId]);


    const handlePurchaseComplete = (materialId: string, quantity: number) => {
        // Update material inventory
        setMaterials(prev => prev.map(m => m.id === materialId ? { ...m, inventoryKg: m.inventoryKg - quantity } : m));
        
        // Add new transaction
        const material = materials.find(m => m.id === materialId);
        if (material) {
            const newTransaction = {
                id: `T${Date.now()}`,
                materialTokenId: material.tokenId,
                materialName: material.name,
                quantityKg: quantity,
                date: new Date().toISOString(),
                centerName: "Marketplace Buyer", // Placeholder
                status: TransactionStatus.Sold,
            };
            setTransactions(prev => [newTransaction, ...prev]);
        }
        showToast('Compra realizada con éxito!', 'success');
    };

    const seller = selectedMaterial ? centers.find(c => c.city === selectedMaterial.location) : null;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace</h2>
                <p className="text-gray-600 dark:text-gray-400">Descubre y compra materiales reciclables disponibles</p>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full md:w-1/3">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
                    <select id="category" name="category" value={filters.category} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
                        {categories.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="w-full md:w-1/3">
                    <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio máximo</label>
                    <input type="number" id="maxPrice" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" placeholder="0.00" />
                </div>
                <div className="w-full md:w-1/3">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ubicación</label>
                     <select id="location" name="location" value={filters.location} onChange={handleFilterChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600">
                        {locations.map(loc => <option key={loc}>{loc}</option>)}
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMaterials.map(material => (
                    <ProductCard key={material.id} material={material} onBuy={handleBuyClick} onShowSeller={handleSellerInfoClick} />
                ))}
            </div>

            {isCheckoutVisible && selectedMaterial && (
                <CheckoutModal 
                    material={selectedMaterial} 
                    onClose={() => setCheckoutVisible(false)} 
                    onPurchase={handlePurchaseComplete}
                />
            )}
            
            {isSellerInfoVisible && seller && (
                <Modal isOpen={true} onClose={() => setSellerInfoVisible(false)} title="Información del Vendedor">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">{seller.companyName}</h3>
                        <p className="flex items-center gap-2"><LocationMarkerIcon className="w-5 h-5" /> {seller.fullAddress}, {seller.city}</p>
                        <p className="flex items-center gap-2"><PhoneIcon className="w-5 h-5" /> {seller.phone}</p>
                        <p className="flex items-center gap-2"><MailIcon className="w-5 h-5" /> {seller.email}</p>
                        <button onClick={() => { setSellerInfoVisible(false); handleBuyClick(selectedMaterial!); }} className="w-full bg-primary-600 text-white py-2 rounded-md mt-4">Comprar a este Vendedor</button>
                    </div>
                </Modal>
            )}

        </div>
    );
};

const ProductCard: React.FC<{ material: Material; onBuy: (m: Material) => void; onShowSeller: (m: Material) => void; }> = ({ material, onBuy, onShowSeller }) => {
    const { color, icon } = categoryStyles[material.category];
    const categoryTagColor = `bg-${color}-100 text-${color}-800 dark:bg-${color}-900 dark:text-${color}-300`;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
            <div className="h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-700">{icon}</div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-bold">{material.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${categoryTagColor}`}>{material.category}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">{material.description}</p>
                <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between"><span>Peso:</span><span className="font-semibold">{material.inventoryKg} kg</span></div>
                    <div className="flex justify-between"><span>Precio:</span><span className="font-semibold">{material.pricePerKg.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}/kg</span></div>
                    <div className="flex justify-between"><span>Ubicación:</span><span className="font-semibold">{material.location}</span></div>
                    <div className="flex justify-between"><span>Calidad:</span><span className="font-semibold">{material.quality}</span></div>
                </div>
                <div className="mt-auto flex gap-2">
                    <button onClick={() => onBuy(material)} className="flex-1 bg-primary-600 text-white px-3 py-2 rounded-md hover:bg-primary-700 text-sm font-semibold">Comprar</button>
                    <button onClick={() => onShowSeller(material)} className="flex-1 bg-gray-200 dark:bg-gray-600 px-3 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 text-sm font-semibold">Ver Vendedor</button>
                </div>
            </div>
        </div>
    )
};


const CheckoutModal: React.FC<{ material: Material; onClose: () => void; onPurchase: (materialId: string, quantity: number) => void; }> = ({ material, onClose, onPurchase }) => {
    const [step, setStep] = useState(1);
    const [quantity, setQuantity] = useState(material.inventoryKg);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [selectedCrypto, setSelectedCrypto] = useState('');
    const [cryptoAmount, setCryptoAmount] = useState('');

    const totalPrice = quantity * material.pricePerKg;
    const totalPriceUSD = totalPrice / 37; // Approximate conversion rate

    useEffect(() => {
        if (paymentMethod === 'Criptomoneda' && selectedCrypto) {
            const rates: { [key: string]: number } = {
                Bitcoin: 65000,
                Ethereum: 3500,
                USDT: 1,
            };
            const rate = rates[selectedCrypto];
            if (rate) {
                setCryptoAmount((totalPriceUSD / rate).toFixed(8));
            } else {
                setCryptoAmount('');
            }
        }
    }, [totalPriceUSD, selectedCrypto, paymentMethod]);


    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1 && !paymentMethod) { 
            alert("Seleccione un método de pago"); 
            return; 
        }
        if (step === 2 && paymentMethod === 'Criptomoneda' && !selectedCrypto) {
            alert("Seleccione una criptomoneda");
            return;
        }
        if (step < 3) {
            setStep(s => s + 1);
        } else {
            onPurchase(material.id, quantity);
            onClose();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(s => s - 1);
        }
    };
    
    const handlePrint = () => {
        const qrData = JSON.stringify({
            product: material.name,
            quantity: `${quantity} kg`,
            total: totalPrice.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' }),
            tokenId: material.tokenId,
            date: new Date().toISOString(),
        });

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;

        const receiptContent = `
            <html>
                <head>
                    <title>Recibo - RECYTOKEN-UP</title>
                    <style>
                        body {
                            font-family: 'Courier New', Courier, monospace;
                            font-size: 10px;
                            color: #000;
                            width: 80mm;
                            margin: 0;
                            padding: 5mm;
                            box-sizing: border-box;
                        }
                        .receipt-container {
                            width: 100%;
                        }
                        .center {
                            text-align: center;
                        }
                        h1 {
                            font-size: 14px;
                            margin: 0;
                        }
                        h2 {
                            font-size: 12px;
                            margin: 10px 0 5px 0;
                            border-top: 1px dashed #000;
                            border-bottom: 1px dashed #000;
                            padding: 5px 0;
                        }
                        p {
                            margin: 2px 0;
                        }
                        .details {
                            margin-top: 10px;
                        }
                        .details p {
                            word-wrap: break-word;
                        }
                        .line-separator {
                            border-top: 1px dashed #000;
                            margin: 10px 0;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            padding: 2px 0;
                        }
                        th {
                            text-align: left;
                        }
                        .text-right {
                            text-align: right;
                        }
                        .qr-code {
                            margin: 10px auto;
                            display: block;
                        }
                    </style>
                </head>
                <body>
                    <div class="receipt-container">
                        <div class="center">
                            <h1>RECYTOKEN-UP</h1>
                            <p>Managua, Nicaragua</p>
                        </div>
                        
                        <div class="center">
                            <h2>Recibo de Compra</h2>
                        </div>

                        <div class="details">
                            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-NI')}</p>
                            <p><strong>Token ID:</strong> <br/>${material.tokenId}</p>
                        </div>

                        <div class="line-separator"></div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th class="text-right">Cant.</th>
                                    <th class="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${material.name}</td>
                                    <td class="text-right">${quantity} kg</td>
                                    <td class="text-right">${totalPrice.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="line-separator"></div>

                        <div class="text-right">
                            <p><strong>SUBTOTAL:</strong> ${totalPrice.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</p>
                            <p><strong>TOTAL:</strong> ${totalPrice.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</p>
                        </div>

                        <div class="line-separator"></div>
                        
                        <div class="center details">
                            <p>Método de Pago: ${paymentMethod}</p>
                            <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
                            <p>¡Gracias por su compra y por reciclar!</p>
                        </div>
                    </div>
                </body>
            </html>
        `;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(receiptContent);
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500); 
        } else {
            alert("No se pudo abrir la ventana de impresión. Por favor, deshabilite el bloqueador de ventanas emergentes.");
        }
    };

    const TransactionSummary = () => (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-6 border dark:border-gray-700">
            <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Resumen de la Transacción</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700 dark:text-gray-300">
                <div><strong>Producto:</strong></div><div className="text-right">{material.name}</div>
                <div><strong>Cantidad:</strong></div><div className="text-right">{quantity} kg</div>
                <div><strong>Total:</strong></div><div className="text-right font-bold">{totalPrice.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</div>
                {paymentMethod && <><div><strong>Método:</strong></div><div className="text-right">{paymentMethod}</div></>}
            </div>
        </div>
    );

    return (
        <Modal isOpen={true} onClose={onClose} title="Detalles de Pago" size="lg">
            <div className="mb-6">
                 <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{`Paso ${step} de 3: ${
                    step === 1 ? 'Detalles de la transacción' : 
                    step === 2 ? 'Información del método de pago' : 
                    'Confirmación'
                }`}</p>
                <div className="flex justify-between mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <span className={step >= 1 ? 'text-primary-600' : ''}>Paso 1</span>
                    <span className={step >= 2 ? 'text-primary-600' : ''}>Paso 2</span>
                    <span className={step >= 3 ? 'text-primary-600' : ''}>Paso 3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div className="bg-primary-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
                </div>
            </div>

            <form onSubmit={handleNext}>
                {step === 1 && (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Detalles de la transacción</h3>
                        <InputField label="Cliente" value="Usuario del Sistema" readOnly />
                        <InputField label="Producto" value={material.name} readOnly />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad (kg)</label>
                            <input type="number" value={quantity} onChange={e => setQuantity(Math.min(material.inventoryKg, Number(e.target.value)))} max={material.inventoryKg} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" />
                        </div>
                        <InputField label="Precio Total" value={totalPrice.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })} readOnly />
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Método de Pago</label>
                            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" required>
                                <option value="">Seleccionar método</option>
                                <option value="Tarjeta Crédito/Débito">Tarjeta Crédito/Débito</option>
                                <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                                <option value="Criptomoneda">Criptomoneda</option>
                            </select>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button type="submit" className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 font-semibold">Siguiente</button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <TransactionSummary />
                        
                        {paymentMethod === 'Tarjeta Crédito/Débito' && (
                            <div className="space-y-4">
                                <h4 className="font-semibold text-lg flex items-center gap-2"><CreditCardIcon /> Datos de la Tarjeta</h4>
                                <InputField label="Número de Tarjeta *" name="cardNumber" placeholder="0000 0000 0000 0000" required />
                                <InputField label="Nombre del Titular *" name="cardName" placeholder="Nombre como aparece en la tarjeta" required />
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <InputField label="Fecha de Vencimiento *" name="cardExpiry" placeholder="MM/AA" required />
                                    </div>
                                    <div className="w-1/2">
                                        <InputField label="CVV *" name="cardCvv" placeholder="123" required />
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'Transferencia Bancaria' && (
                            <div className="space-y-4">
                                <h4 className="font-semibold text-lg flex items-center gap-2"><BanknotesIcon /> Datos de Transferencia</h4>
                                <InputField label="Número de Cuenta Beneficiario" value="1234567890123456" readOnly />
                                <InputField label="Nombre del Beneficiario" value="RECYTOKEN-UP S.A." readOnly />
                                <InputField label="Banco" value="Banco de América Central (BAC)" readOnly />
                                <InputField label="Monto a Transferir" value={totalPrice.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })} readOnly />
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                                    <strong>Instrucciones:</strong> Realiza la transferencia con los datos mostrados y conserva el comprobante para verificación.
                                </div>
                            </div>
                        )}

                        {paymentMethod === 'Criptomoneda' && (
                            <div className="space-y-4">
                                <h4 className="font-semibold text-lg flex items-center gap-2"><BlockchainIcon /> Datos de Criptomoneda</h4>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Criptomoneda *</label>
                                    <select value={selectedCrypto} onChange={e => setSelectedCrypto(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" required>
                                        <option value="">Seleccionar criptomoneda</option>
                                        <option value="Bitcoin">Bitcoin (BTC)</option>
                                        <option value="Ethereum">Ethereum (ETH)</option>
                                        <option value="USDT">Tether (USDT)</option>
                                    </select>
                                </div>
                                <InputField label="Dirección de Wallet Destino" value="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" readOnly />
                                <InputField label="Monto en USD" value={totalPriceUSD.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} readOnly />
                                <InputField label="Monto Aproximado en Cripto" value={cryptoAmount ? `${cryptoAmount}` : ''} readOnly />
                                 <div className="p-3 bg-yellow-50 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm">
                                    <strong>Nota:</strong> El monto en criptomoneda es aproximado y puede variar según el tipo de cambio al momento de la transacción.
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between mt-8">
                            <button type="button" onClick={handleBack} className="px-6 py-2 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold">Atrás</button>
                            <button type="submit" className="px-6 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 font-semibold">Procesar Pago</button>
                        </div>
                    </div>
                )}
                 {step === 3 && (
                    <div className="text-center space-y-4">
                         <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="font-semibold text-xl">Transacción Exitosa</h3>
                        <p>Tu compra de {quantity} kg de {material.name} ha sido completada.</p>
                        <div className="flex gap-4">
                            <button type="button" onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"><PrinterIcon className="w-5 h-5"/> Imprimir Recibo</button>
                            <button type="submit" className="flex-1 bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700">Cerrar</button>
                        </div>
                    </div>
                )}
            </form>
        </Modal>
    );
};

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input {...props} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 read-only:bg-gray-100 dark:read-only:bg-gray-700" />
    </div>
);

export default Marketplace;