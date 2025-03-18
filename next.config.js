/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '**',
      },
    ],
    // 在生产环境中应该移除unoptimized设置，以启用图片优化
    unoptimized: true
  },
  serverExternalPackages: ['pg'],
  typescript: {
    ignoreBuildErrors: true
  },
  devIndicators: {
    position: 'bottom-right',
  },
  compiler: {
    // 移除React属性，减小包体积
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    // 更新为 Next.js 15.2.2 支持的配置
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // 添加滚动恢复行为，确保页面导航时始终滚动到顶部
    scrollRestoration: false,
  },
  // 启用gzip压缩
  compress: true,
  // 优化页面加载
  reactStrictMode: true,
  poweredByHeader: false,
};

module.exports = nextConfig; 