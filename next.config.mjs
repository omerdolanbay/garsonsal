/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/admindolanbay/:path*',
        destination: '/superadmin/:path*',
      },
      {
        source: '/admindolanbay',
        destination: '/superadmin',
      },
    ];
  },
};

export default nextConfig;
