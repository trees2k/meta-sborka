import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: false, // отключаем Turbopack, включаем Webpack
}

export default nextConfig