export const environment = {
  production: false,
  api: 'http://localhost:3001/api',
  auth: {
    loginURL: '/auth/login',
    cookieTokenName: 'token',
  },
  httpRequestRetryAmount: 1,
};
