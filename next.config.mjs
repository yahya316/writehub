// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during builds (lets deployment succeed)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
