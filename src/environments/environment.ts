export const environment = {
  production: false,
  api: 'http://localhost:3001/api',
  auth: {
    loginURL: '/auth/login',
    logoutURL: '/auth/logout',
    cookieTokenName: 'token',
  },
  httpRequestRetryAmount: 1,
};
