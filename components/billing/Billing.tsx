import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AppContext, AppContextType } from '../../context/AppContext';
import { Invoice, InvoiceStatus } from '../../types';
import Modal from '../common/Modal';
import { SearchIcon, PlusIcon, PrinterIcon, CreditCardIcon, BanknotesIcon, BlockchainIcon } from '../common/Icons';

const statusStyles = {
    [InvoiceStatus.Paid]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [InvoiceStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [InvoiceStatus.Overdue]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};


const ReceiptVoucher: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    
    const handlePrint = () => {
        const qrData = JSON.stringify({
            invoiceNumber: invoice.invoiceNumber,
            client: invoice.centerName,
            total: invoice.total.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' }),
            date: new Date(invoice.issueDate).toISOString(),
        });

        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qrData)}`;

        const receiptContent = `
            <html>
                <head>
                    <title>Factura - ${invoice.invoiceNumber}</title>
                    <style>
                        body { font-family: 'Courier New', Courier, monospace; font-size: 10px; color: #000; width: 80mm; margin: 0; padding: 5mm; box-sizing: border-box; }
                        .receipt-container { width: 100%; }
                        .center { text-align: center; }
                        h1 { font-size: 14px; margin: 0; }
                        h2 { font-size: 12px; margin: 10px 0 5px 0; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 5px 0; }
                        p { margin: 2px 0; }
                        .details { margin-top: 10px; }
                        .line-separator { border-top: 1px dashed #000; margin: 10px 0; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { padding: 2px 0; font-size: 9px; }
                        th { text-align: left; }
                        .text-right { text-align: right; }
                        .qr-code { margin: 10px auto; display: block; }
                    </style>
                </head>
                <body>
                    <div class="receipt-container">
                        <div class="center">
                            <h1>RECYTOKEN-UP</h1>
                            <p>Managua, Nicaragua</p>
                        </div>
                        <div class="center"><h2>Factura: ${invoice.invoiceNumber}</h2></div>
                        <div class="details">
                            <p><strong>Fecha:</strong> ${new Date(invoice.issueDate).toLocaleString('es-NI')}</p>
                            <p><strong>Cliente:</strong> ${invoice.centerName}</p>
                        </div>
                        <div class="line-separator"></div>
                        <table>
                            <thead><tr><th>Desc.</th><th class="text-right">Cant.</th><th class="text-right">Total</th></tr></thead>
                            <tbody>
                                ${invoice.items.map(item => `
                                    <tr>
                                        <td>${item.materialName}</td>
                                        <td class="text-right">${item.quantityKg} kg</td>
                                        <td class="text-right">${item.total.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        <div class="line-separator"></div>
                        <div class="text-right">
                            <p><strong>Subtotal:</strong> ${invoice.subtotal.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</p>
                            <p><strong>Impuesto (15%):</strong> ${invoice.tax.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</p>
                            <p><strong>TOTAL:</strong> ${invoice.total.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</p>
                        </div>
                        <div class="line-separator"></div>
                        <div class="center details">
                            <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
                            <p>¡Gracias por su negocio!</p>
                        </div>
                    </div>
                </body>
            </html>`;
        
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(receiptContent);
            printWindow.document.close();
            setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
        }
    };

    return (
        <div className="space-y-4">
            {/* Invoice Summary */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg border dark:border-neutral-700">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="font-semibold text-lg text-neutral-800 dark:text-neutral-200">Factura #{invoice.invoiceNumber}</h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Cliente: {invoice.centerName}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-sm text-neutral-600 dark:text-neutral-400">Emitida: {new Date(invoice.issueDate).toLocaleDateString()}</p>
                         <p className="text-sm text-neutral-600 dark:text-neutral-400">Vence: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b dark:border-neutral-600">
                            <tr>
                                <th className="text-left py-2 font-medium">Material</th>
                                <th className="text-right py-2 font-medium">Cant. (kg)</th>
                                <th className="text-right py-2 font-medium">P/kg</th>
                                <th className="text-right py-2 font-medium">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, index) => (
                                <tr key={index} className="border-b dark:border-neutral-700 last:border-b-0">
                                    <td className="py-2">{item.materialName}</td>
                                    <td className="text-right py-2">{item.quantityKg.toFixed(2)}</td>
                                    <td className="text-right py-2">{item.pricePerKg.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</td>
                                    <td className="text-right py-2">{item.total.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="mt-4 flex justify-end">
                    <div className="w-full max-w-xs space-y-1">
                         <div className="flex justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">Subtotal:</span>
                            <span>{invoice.subtotal.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-600 dark:text-neutral-400">Impuesto (15%):</span>
                            <span>{invoice.tax.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t dark:border-neutral-600 pt-1 mt-1">
                            <span>Total:</span>
                            <span>{invoice.total.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print button */}
            <div className="mt-6 flex justify-end gap-4">
                <button onClick={handlePrint} className="w-full bg-primary-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 font-semibold">
                    <PrinterIcon className="w-5 h-5" /> Imprimir Factura
                </button>
            </div>
        </div>
    );
};

const PaymentFlow: React.FC<{ invoice: Invoice; onPaymentSuccess: () => void; onBack: () => void; }> = ({ invoice, onPaymentSuccess, onBack }) => {
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [selectedCrypto, setSelectedCrypto] = useState('');
    const [cryptoAmount, setCryptoAmount] = useState('');

    const totalPriceUSD = invoice.total / 37; // Approximate conversion

    useEffect(() => {
        if (paymentMethod === 'Criptomoneda' && selectedCrypto) {
            const rates: { [key: string]: number } = { Bitcoin: 65000, Ethereum: 3500, USDT: 1 };
            setCryptoAmount((totalPriceUSD / rates[selectedCrypto]).toFixed(8));
        }
    }, [totalPriceUSD, selectedCrypto, paymentMethod]);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1 && !paymentMethod) { alert("Seleccione un método de pago"); return; }
        if (step === 2) { 
            // Simulate payment processing
            onPaymentSuccess();
        } else {
            setStep(s => s + 1);
        }
    };

    return (
        <form onSubmit={handleNext}>
            {step === 1 && (
                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Paso 1: Método de Pago</h3>
                    <InputField label="Factura" value={invoice.invoiceNumber} readOnly />
                    <InputField label="Total a Pagar" value={invoice.total.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })} readOnly />
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Método de Pago</label>
                        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="mt-1 block w-full input-field" required>
                            <option value="">Seleccionar método</option>
                            <option value="Tarjeta Crédito/Débito">Tarjeta Crédito/Débito</option>
                            <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                            <option value="Criptomoneda">Criptomoneda</option>
                        </select>
                    </div>
                    <div className="flex justify-between mt-8">
                        <button type="button" onClick={onBack} className="px-6 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 font-semibold">Atrás</button>
                        <button type="submit" className="px-6 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 font-semibold">Siguiente</button>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Paso 2: Detalles de Pago</h3>
                     {paymentMethod === 'Tarjeta Crédito/Débito' && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg flex items-center gap-2"><CreditCardIcon /> Datos de la Tarjeta</h4>
                            <InputField label="Número de Tarjeta *" name="cardNumber" placeholder="0000 0000 0000 0000" required />
                            <InputField label="Nombre del Titular *" name="cardName" placeholder="Nombre como aparece en la tarjeta" required />
                            <div className="flex gap-4">
                                <div className="w-1/2"><InputField label="Fecha de Vencimiento *" name="cardExpiry" placeholder="MM/AA" required /></div>
                                <div className="w-1/2"><InputField label="CVV *" name="cardCvv" placeholder="123" required /></div>
                            </div>
                        </div>
                    )}
                    {paymentMethod === 'Transferencia Bancaria' && (
                        <div className="space-y-4">
                             <h4 className="font-semibold text-lg flex items-center gap-2"><BanknotesIcon /> Datos de Transferencia</h4>
                             <InputField label="Número de Cuenta Beneficiario" value="1234567890123456" readOnly />
                             <InputField label="Banco" value="Banco de América Central (BAC)" readOnly />
                             <div className="p-3 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                                 <strong>Instrucciones:</strong> Realiza la transferencia y conserva el comprobante para verificación.
                             </div>
                        </div>
                    )}
                    {paymentMethod === 'Criptomoneda' && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg flex items-center gap-2"><BlockchainIcon /> Datos de Criptomoneda</h4>
                            <select value={selectedCrypto} onChange={e => setSelectedCrypto(e.target.value)} className="mt-1 block w-full input-field" required>
                                <option value="">Seleccionar criptomoneda</option>
                                <option value="Bitcoin">Bitcoin (BTC)</option><option value="Ethereum">Ethereum (ETH)</option><option value="USDT">Tether (USDT)</option>
                            </select>
                            <InputField label="Dirección de Wallet Destino" value="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" readOnly />
                            <InputField label="Monto Aproximado en Cripto" value={cryptoAmount ? `${cryptoAmount}` : ''} readOnly />
                        </div>
                    )}
                    <div className="flex justify-between mt-8">
                        <button type="button" onClick={() => setStep(1)} className="px-6 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 font-semibold">Atrás</button>
                        <button type="submit" className="px-6 py-2 rounded-md bg-primary-600 text-white font-semibold">Procesar Pago</button>
                    </div>
                </div>
            )}
        </form>
    );
};


const InvoiceViewModal: React.FC<{ invoice: Invoice; onClose: () => void; setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>; showToast: (message: string, type: 'success' | 'error' | 'info') => void; }> = ({ invoice, onClose, setInvoices, showToast }) => {
    const isPaid = invoice.status === InvoiceStatus.Paid;
    const [view, setView] = useState<'details' | 'payment' | 'receipt'>(isPaid ? 'receipt' : 'details');

    const handlePaymentSuccess = () => {
        setInvoices(prev => prev.map(inv => inv.id === invoice.id ? { ...inv, status: InvoiceStatus.Paid } : inv));
        showToast(`Factura ${invoice.invoiceNumber} pagada con éxito.`, 'success');
        setView('receipt');
    };

    const renderContent = () => {
        switch (view) {
            case 'payment':
                return <PaymentFlow invoice={invoice} onPaymentSuccess={handlePaymentSuccess} onBack={() => setView('details')} />;
            case 'receipt':
                return <ReceiptVoucher invoice={invoice} />;
            case 'details':
            default:
                return (
                    <div>
                        <div className="flex justify-between items-start"><h3 className="text-2xl font-bold">{invoice.invoiceNumber}</h3><span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[invoice.status]}`}>{invoice.status}</span></div>
                        <p className="text-neutral-500 dark:text-neutral-400">Para: {invoice.centerName}</p>
                         <div className="mt-6 flex justify-end gap-4 border-t pt-4 dark:border-neutral-700">
                             <button onClick={onClose} className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-600 font-semibold">Cerrar</button>
                             {!isPaid && <button onClick={() => setView('payment')} className="px-4 py-2 rounded-md bg-primary-600 text-white font-semibold">Pagar Factura</button>}
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <Modal isOpen={true} onClose={onClose} title={`Factura ${invoice.invoiceNumber}`} size="lg">
            {renderContent()}
        </Modal>
    );
};

const Billing: React.FC = () => {
    const { invoices, setInvoices, showToast } = useContext(AppContext) as AppContextType;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    
    const filteredInvoices = useMemo(() => {
        return invoices.filter(inv => {
            const matchesSearch = inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || inv.centerName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [invoices, searchTerm, statusFilter]);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative flex-grow w-full md:w-auto">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"><SearchIcon /></span>
                    <input type="text" placeholder="Buscar factura..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 input-field" />
                </div>
                 <div className="flex-shrink-0">
                    {['all', ...Object.values(InvoiceStatus)].map((status: string) => (
                        <button key={status} onClick={() => setStatusFilter(status as any)} className={`px-3 py-1 rounded-full text-sm font-semibold mr-2 transition-colors ${statusFilter === status ? 'bg-primary-600 text-white' : 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600'}`}>
                            {status === 'all' ? 'Todos' : status}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-xl shadow-sm">
                <table className="w-full text-sm text-left text-neutral-500 dark:text-neutral-400">
                     <thead className="text-xs text-neutral-700 uppercase bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-300">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-bold"># Factura</th>
                            <th scope="col" className="px-6 py-4 font-bold">Cliente</th>
                            <th scope="col" className="px-6 py-4 font-bold">Fecha Emisión</th>
                            <th scope="col" className="px-6 py-4 font-bold">Total</th>
                            <th scope="col" className="px-6 py-4 font-bold">Estado</th>
                            <th scope="col" className="px-6 py-4 font-bold">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map((invoice, index) => (
                            <tr key={invoice.id} className={`border-b dark:border-neutral-700 ${index % 2 === 0 ? 'bg-white dark:bg-neutral-800' : 'bg-neutral-50 dark:bg-neutral-800/50'}`}>
                                <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">{invoice.invoiceNumber}</td>
                                <td className="px-6 py-4">{invoice.centerName}</td>
                                <td className="px-6 py-4">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{invoice.total.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' })}</td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[invoice.status]}`}>{invoice.status}</span></td>
                                <td className="px-6 py-4"><button onClick={() => setSelectedInvoice(invoice)} className="font-semibold text-primary-600 dark:text-primary-500 hover:underline">Ver</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedInvoice && <InvoiceViewModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} setInvoices={setInvoices} showToast={showToast} />}
        </div>
    );
};

const InputField: React.FC<any> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
        <input {...props} className="mt-1 block w-full input-field" />
    </div>
);


export default Billing;