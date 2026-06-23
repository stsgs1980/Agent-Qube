import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@zai/select-element'],
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    '.space-z.ai',
    'localhost',
    '127.0.0.1',
    '.z.ai',
    '.a0.dev',
    '.trycloudflare.com',
    '.loca.lt',
    '.local-credentialless.app',
    '.gitpod.io',
    '.codesandbox.io',
    '.stackblitz.io',
    '.repl.co',
    '.vercel.app',
    '.netlify.app',
  ],
};

export default nextConfig;
