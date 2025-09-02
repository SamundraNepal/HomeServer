module.exports = {
  reactStrictMode: false, // Disable Strict Mode

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.snapforlifes.online',
        port: '',
        pathname: '/Storage/**', // This should be forward slashes and match the folder structure
      },
    ],
  },
};
