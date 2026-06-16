import { fileURLToPath } from 'url';
import path from 'path';

// 🚀 Calculamos la ruta absoluta real para Turbopack
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ⚡ DEJA ESTA SECCIÓN ASÍ PARA APAGAR EL LOGO FLOTANTE:
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false, // 👈 Esta propiedad es la que apaga el círculo de Turbopack
  },

  // 🛠️ Mantenemos la ruta absoluta que arregló la pantalla en blanco
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;