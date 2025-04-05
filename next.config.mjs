/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        { protocol: "https", hostname: "media.istockphoto.com" },
        { protocol: "https", hostname: "www.istockphoto.com" }, // Add this
        { protocol: "https", hostname: "via.placeholder.com" },
        { protocol: "https", hostname: "amyshealthybaking.com/" },
        { protocol: "https", hostname: "joyofbaking.com" },
      ],
    },
  };
  
  export default nextConfig;
  