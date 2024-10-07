/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "images.thisisme1228.com",
        // pathname: "/images",
      },
    ],
    //   remotePatterns: [
    //     {
    //       protocol: "https",
    //       hostname: "utfs.io",
    //       pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
    //     },
    //   ],
  },
};

export default nextConfig;
