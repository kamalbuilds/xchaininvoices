await import('./env.mjs');

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        hostname: 'icons.llamao.fi',
      },
      {
        hostname: 'api.dicebear.com',
      },
    ],
  },
};

export default config;
