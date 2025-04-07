/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["media.istockphoto.com","media-hosting.imagekit.io","upload.wikimedia.org"],
        dangerouslyAllowSVG:true
    }
};

module.exports = nextConfig;
