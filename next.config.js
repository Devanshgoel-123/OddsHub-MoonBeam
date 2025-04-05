/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["hindustantimes.com/ht-img/img/2025/04/05/550x309/Trump_ghibli_photos_1743089156284_1743836359321.jpeg","media-hosting.imagekit.io"],
        dangerouslyAllowSVG:true
    },
    env: {
    SERVER_URL: process.env.SERVER_URL,
    
  },
//   async rewrites(){
//     return [
//         {
//             source:'/api',
//             destination:"https://backend-base-sepolia-final.vercel.app"
//         },
//         {
//             source:'/api/get-all-markets',
//             destination:"https://backend-base-sepolia-final.vercel.app/get-all-markets"
//         },
//         {
//             source:'/api/get-outcome-tokens/:marketId',
//             destination:"https://backend-base-sepolia-final.vercel.app/get-all-markets/:marketId"
//         }
//     ]
//   }
  
};

module.exports = nextConfig;
