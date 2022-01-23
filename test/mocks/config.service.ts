export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_SECRET':
        return 'jwtSecret';
      case 'JWT_REFRESH_SECRET':
        return 'jwtRefreshSecret';
      case 'GOOGLE_CLIENT_ID':
        return 'googleClientId';
      case 'GOOGLE_CLIENT_SECRET':
        return 'googleClientSecret';
      case 'GOOGLE_CALLBACK_URL':
        return 'googleCallbackUrl';
      case 'JWT_SECRET_EXPIRE_IN':
        return 10;
      case 'JWT_REFRESH_SECRET_EXPIRE_IN':
        return '2d';
      case 'CORONA_API_URL':
        return 'coronaApiUrl';
      case 'GOOGLE_MOBILE_CALLBACK_URL':
        return 'googleMobileCallbackUrl';
      case 'MOBILE_AUTH_HOSTNAME':
        return 'mobileAuthHostname';
      case 'MOBILE_AUTH_PATHNAME':
        return 'mobileAuthPathname';
    }
  },
};
