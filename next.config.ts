import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  
  // Configuración para Server Actions - Permitir archivos más grandes
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb', // Aumentar límite para permitir múltiples imágenes
    },
  },
  
  // Configuración de imágenes
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  /* config options here */
};

export default nextConfig;
