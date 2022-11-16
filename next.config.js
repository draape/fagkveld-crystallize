const { i18n } = require('./next-i18next.config');

module.exports = {
  env: {
    env: {
      NEXT_PUBLIC_CRYSTALLIZE_TENANT_IDENTIFIER:
        process.env.NEXT_PUBLIC_CRYSTALLIZE_TENANT_IDENTIFIER,
      NEXT_PUBLIC_SERVICE_API_URL: process.env.NEXT_PUBLIC_SERVICE_API_URL
    }
  },
  i18n,
  async redirects() {
    return [
      {
        source: '/web-frontpage',
        destination: '/',
        permanent: false
      }
    ];
  }
};
