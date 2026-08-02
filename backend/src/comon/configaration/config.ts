export const BaseConfig = () => ({
  environment: process.env.NODE_ENV,
  frontendUrl: process.env.FRONTEND_URL,
  baseUrl: process.env.BASE_URL,
  port: process.env.PORT,
  database: {
    dbUrl: process.env.DB_URL,
    type: process.env.DB_TYPE,
    autoloadEntities: true,
    synchronize: process.env.NODE_ENV === 'development',
  },
  redis: {
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  socialAuth: {
    facebook: {
      callbackUrl: process.env.FACEBOOK_CALLBACK_URL,
      clientId: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
    },
    linkedin: {
      callbackUrl: process.env.LINKEDIN_CALLBACK_URL,
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    },
    google: {
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  baseAuth: {
    jwt: {
      refreshTokenExpiry: process.env.JWT_EXPIRES_IN_REFRESH,
      authTokenExpiry: process.env.JWT_EXPIRES_IN,
      refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
      authTokenSecret: process.env.JWT_ACCESS_SECRET,
    },
  },
  email: {
    smtp: {
      mailFrom: process.env.MAIL_FROM,
      mailPassword: process.env.MAIL_PASS,
      mailUser: process.env.MAIL_USER,
      port: process.env.MAIL_PORT,
      host: process.env.MAIL_HOST,
    },
  },
});
