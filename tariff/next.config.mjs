/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*', // Proxy requests starting with /api
                destination: 'http://127.0.0.1:5000/:path*', // Forward to Flask backend
            },
        ];
    },
};

export default nextConfig;