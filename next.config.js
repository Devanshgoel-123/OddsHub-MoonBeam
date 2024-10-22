/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    env: {
    SERVER_URL: process.env.SERVER_URL,
  },
  async rewrites(){
    return [
        {
            source:'/api',
            destination:"https://backend-base-sepolia-final.vercel.app"
        },
        {
            source:'/api/get-all-markets',
            destination:"https://backend-base-sepolia-final.vercel.app/get-all-markets"
        },
        {
            source:'/api/get-outcome-tokens/:marketId',
            destination:"https://backend-base-sepolia-final.vercel.app/get-all-markets/:marketId"
        }
    ]
  }
  
};

module.exports = nextConfig;
