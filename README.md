📌 RECYTOKEN — Recycling Marketplace

RECYTOKEN is a Progressive Web Application (PWA) designed as a sustainable marketplace where individuals and companies can securely and transparently buy and sell recyclable materials.

The platform integrates a digital traceability system that enables tracking of materials throughout their lifecycle, from collection to commercialization, thus fostering the circular economy and environmental responsibility.

With a modern, responsive, and accessible design, RECYTOKEN provides management of:

🏭 Collection centers and registered companies.
📦 Materials classified by type, quality, and available quantity.
🔄 Traceability of movements through unique tokens.
🛒 Marketplace for direct transactions between participants.
📊 Real-time analytics on environmental and financial impact.

The goal of the project is to promote sustainability, ensure transaction transparency, and empower communities through technology.

The RECYTOKEN-UP application was developed using the Next.js 13 framework with React 18 as the foundation for building modular and reusable interfaces. Tailwind CSS was implemented as the styling system, enabling a responsive, modern, and consistent design aligned with the platform’s sustainable green identity. For data visualization, Recharts was used to generate dynamic and interactive charts, while Lucide-react provided a lightweight and scalable icon set. The application was configured as a PWA (Progressive Web App) using manifest.json and sw.js, allowing installation on mobile and desktop devices with basic offline support. Additionally, LocalStorage persistence and blockchain simulation were included for recyclable material traceability, ensuring a smooth and realistic platform experience.

The current application already employs an effective approach to simulate Web3, smart contracts, and blockchain functionality. Below is an explanation of how this simulation works and how it relates to real-world concepts:

1. Token Simulation (NFTs) for Materials

Each batch of recyclable material is treated as a unique digital asset, similar to a Non-Fungible Token (NFT).

How it is currently simulated:

In types.ts, the Material interface includes two key properties:

tokenId: string; (e.g., TKN-PET-001X) — the unique identifier of the token. In a real blockchain, this would be the NFT ID representing that PET batch.

walletAddress: string; (e.g., 0x1A...a2B) — simulates the digital wallet (like MetaMask) that owns the token. In the app, it represents the collection center that owns the material.

When you create a new material in the form (MaterialForm.tsx), the application automatically generates a simulated tokenId and walletAddress. This process is analogous to “minting” an NFT on a blockchain.

2. Blockchain Traceability Simulation

Blockchain’s main advantage is its immutable and transparent transaction log. The Traceability section of the app imitates this perfectly.

How it is currently simulated:

Every time an important event occurs with a material (collected, processed, sold), a new Transaction object is created (defined in types.ts).

All transactions are linked by the materialTokenId.

In the Traceability section, when you search for a tokenId, the app filters and displays the complete history of that material batch, ordered by date.

This is equivalent to using a block explorer like Etherscan, where you can search a token and view its entire transfer history. The only difference is that here the data is stored in the browser’s LocalStorage instead of a distributed network.

3. Smart Contract Logic Simulation

Smart contracts are programs executed on the blockchain that automatically enforce business rules. In the app, this logic is simulated within React functions.

How it is currently simulated:

Example: Marketplace.tsx when a user purchases a material.

Contract Rule: “You can only buy if there is available inventory.”

Simulation: The checkout form (CheckoutModal) prevents purchasing more than the available material.inventoryKg.

Contract Rule: “When purchase is complete, inventory must decrease and the sale must be recorded.”

Simulation: The function handlePurchaseComplete does exactly this:

Updates the materials state to reduce inventory.

Creates a new Transaction with the status TransactionStatus.Sold.

This programmatic rule enforcement and resulting state update is essentially the core principle of a smart contract.

✅ Summary of the Simulation
Blockchain/Web3 Concept	Simulation in the Current App
Tokenization (NFT)	tokenId and walletAddress in the Material interface.
Digital Wallet	walletAddress property linking a material to its owner.
Immutability & Traceability	Transaction history linked to materialTokenId.
Smart Contract Logic	Business rules coded in React components (e.g., handlePurchaseComplete).
Transactions	Creation of Transaction objects recording each state change.

This approach is highly effective because it allows developers to design and test the user experience (UX) and application logic quickly and cost-effectively. The final step would be integrating with a real Web3 library (such as ethers.js or web3.js) and deploying smart contracts on a real network (Polygon, Ethereum, etc.).

___________________________________________________________________________________________________________________



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