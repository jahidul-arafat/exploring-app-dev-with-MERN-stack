import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api-docs',
                destination: '/api/api-docs',
            },
        ];
    },
};

export default nextConfig;
