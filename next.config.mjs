/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'tesseract.js', 'pg', 'qrcode'],
    runtime: 'nodejs'
  }
};



export default nextConfig;

