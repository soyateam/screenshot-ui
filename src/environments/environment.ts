export const environment = {
  production: false,
  api:'http://localhost:3003',
  auth: {
    loginURL: '/auth/login',
    logoutURL: '/auth/logout',
    cookieTokenName: 'token',
  },
  httpRequestRetryAmount: 1,
};
