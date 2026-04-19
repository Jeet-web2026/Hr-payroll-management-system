let accessToken: string | null = null;

export const TokenService = {
  get: () => accessToken,
  set: (token: string) => (accessToken = token),
  clear: () => (accessToken = null),
};
