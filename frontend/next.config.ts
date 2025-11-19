import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Desactivar Turbopack para evitar errores
  experimental: {
    turbo: false,
  },
};

export default nextConfig;
