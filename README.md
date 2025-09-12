📌 RECYTOKEN — Marketplace de Reciclaje

RECYTOKEN es una aplicación web progresiva (PWA) diseñada como un marketplace sostenible donde personas y empresas pueden vender y comprar materiales reciclables de manera segura y transparente.

La plataforma integra un sistema de trazabilidad digital que permite dar seguimiento al ciclo de vida de los materiales desde su recolección hasta su comercialización, fomentando así la economía circular y la responsabilidad ambiental.

Con un diseño moderno, responsivo y accesible, RECYTOKEN facilita la gestión de:

🏭 Centros de acopio y empresas registradas.

📦 Materiales clasificados por tipo, calidad y cantidad disponible.

🔄 Trazabilidad de movimientos mediante tokens únicos.

🛒 Marketplace para comercialización directa entre actores.

📊 Analíticas en tiempo real sobre impacto ambiental y financiero.

El objetivo del proyecto es promover la sostenibilidad, ofrecer transparencia en las transacciones y empoderar a las comunidades a través de la tecnología.
-----------------------------------------------
La aplicación RECYTOKEN-UP fue desarrollada utilizando el framework Next.js 13 con React 18 como base para la construcción de interfaces modulares y reutilizables. Se implementó Tailwind CSS como sistema de estilos, permitiendo un diseño responsivo, moderno y consistente con la identidad visual verde y sostenible de la plataforma. Para la representación de métricas y datos se empleó Recharts, lo que posibilita gráficos dinámicos e interactivos, mientras que Lucide-react aportó un set de íconos livianos y escalables. La aplicación fue configurada como una PWA (Progressive Web App) mediante manifest.json y sw.js, lo que permite instalación en dispositivos móviles y de escritorio, así como soporte offline básico. Adicionalmente, se incluyó persistencia con LocalStorage y simulación de blockchain para la trazabilidad de materiales reciclados, asegurando una experiencia fluida y realista de la plataforma.

-----------------------------------------------
La aplicación actual ya utiliza un enfoque muy efectivo para simular la funcionalidad de Web3, los smart contracts y la blockchain. A continuación te explico cómo lo hace y cómo se relaciona con los conceptos reales:

1. Simulación de Tokens (NFTs) para Materiales
Cada lote de material reciclable se trata como un activo digital único, similar a un Token No Fungible (NFT).
Cómo se simula actualmente: En el archivo types.ts, la interfaz Material tiene dos propiedades clave:
tokenId: string; (Ej: 'TKN-PET-001X') - Este es el "identificador único del token". En una blockchain real, sería el ID único del NFT que representa ese lote de plástico PET.
walletAddress: string; (Ej: '0x1A...a2B') - Simula la dirección de la billetera digital (como MetaMask) que "posee" este token. En la app, representa al centro de acopio que tiene el material.
Cuando creas un nuevo material en el formulario (MaterialForm.tsx), la aplicación genera automáticamente un tokenId y una walletAddress simulados. Este proceso es análogo a "mintear" (crear) un nuevo NFT en la blockchain.

2. Simulación de la Trazabilidad en la Blockchain
La principal ventaja de la blockchain es su registro inmutable y transparente de transacciones. La sección de Trazabilidad de la app imita esto a la perfección.
Cómo se simula actualmente: Cada vez que ocurre un evento importante con un material (recolectado, procesado, vendido), se crea un nuevo objeto Transaction (definido en types.ts). Todas estas transacciones están vinculadas por el materialTokenId.
Cuando vas a la sección Traceability y buscas por un tokenId, la aplicación filtra y muestra el historial completo de ese lote de material, ordenado por fecha.
Esto es exactamente lo que harías en un explorador de bloques como Etherscan: buscarías un token y verías todo su historial de transferencias y cambios de estado. La diferencia es que aquí los datos se guardan en el localStorage del navegador en lugar de en una red distribuida.

3. Simulación de la Lógica de los Smart Contracts
Los "smart contracts" son programas que se ejecutan en la blockchain y aplican reglas de negocio de forma automática. En la app, esta lógica está simulada dentro de las funciones de React.
Cómo se simula actualmente: Tomemos como ejemplo el Marketplace.tsx. Cuando un usuario compra un material:
Regla del Contrato: "Solo se puede comprar si hay inventario disponible".
Simulación en el código: El formulario de pago (CheckoutModal) no te permite comprar más cantidad que el material.inventoryKg disponible.
Regla del Contrato: "Al completar la compra, se debe reducir el inventario del vendedor y registrar la venta".
Simulación en el código: La función handlePurchaseComplete hace exactamente esto:
Actualiza el estado de materials para reducir el inventoryKg.
Crea una nueva Transaction con el estado TransactionStatus.Sold.
Este flujo de lógica, donde las reglas se aplican de forma programática y los estados se actualizan como resultado, es la esencia de un smart contract.
Resumen de la Simulación
Concepto Blockchain/Web3	Simulación en la App Actual
Tokenización (NFT)	tokenId y walletAddress en la interfaz Material.
Billetera Digital	La propiedad walletAddress que asocia un material a un dueño.
Inmutabilidad y Trazabilidad	El historial de Transaction vinculado a un materialTokenId, visible en la sección de Trazabilidad.
Smart Contract	La lógica de negocio dentro de los componentes de React (ej. handlePurchaseComplete en Marketplace).
Transacciones	La creación de objetos Transaction que registran cada cambio de estado.
Este enfoque es extremadamente poderoso porque permite desarrollar y probar toda la experiencia de usuario (UX) y la lógica de la aplicación de una manera rápida y económica, dejando la integración con una biblioteca Web3 real (como ethers.js o web3.js) y el despliegue de contratos en una red (como Polygon, Ethereum, etc.) como un paso final de implementación.