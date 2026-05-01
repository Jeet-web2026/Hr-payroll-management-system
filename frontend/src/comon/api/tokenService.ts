let teamHubaccessToken: string | null = null;

export const TokenService = {
  get: () => teamHubaccessToken,
  set: (token: string) => (teamHubaccessToken = token),
  clear: () => (teamHubaccessToken = null),
};
