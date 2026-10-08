/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['drizzle-orm', 'pg'],
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    return [
      {
        source: '/:image(astro-bot|cyberpunk|elden-ring|fc24|forza5|gow-ragnarok|gta5|hogwarts|minecraft|ps5-slim|rdr2|re4-remake|spider-man|tlou1|wallet-50|wukong).jpg',
        destination: '/covers/:image.jpg',
      },
      {
        source: '/:image(charging-station|dualsense-cosmic|dualsense-edge|elgato-streamdeck|playstation-vr2|ps5-console-covers|pulse-elite|pulse-pro|razer-viper-v3|steelseries-apex-pro|switch-pro-controller|xbox-elite-2).jpg',
        destination: '/accessories/:image.jpg',
      },
    ]
  },
};

export default nextConfig;
