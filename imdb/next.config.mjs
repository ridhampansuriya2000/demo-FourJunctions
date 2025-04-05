/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["image.tmdb.org", "via.placeholder.com", "example.com"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "**",
            },
        ],
    },
};

export default nextConfig;
