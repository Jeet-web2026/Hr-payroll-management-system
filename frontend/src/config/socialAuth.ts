const BASE_URL = import.meta.env.VITE_BASE_URL;

export const SOCIAL_PROVIDERS = {
  google: {
    url: `${BASE_URL}/auth/google`,
  },
  linkedin: {
    url: `${BASE_URL}/auth/linkedin`,
  },
  facebook: {
    url: `${BASE_URL}/auth/facebook`,
  },
};
