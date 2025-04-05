/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["image.tmdb.org", "via.placeholder.com", "example.com", "https://demo-four-junctions.vercel.app", "https://demo-imdb.vercel.app/"],
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
