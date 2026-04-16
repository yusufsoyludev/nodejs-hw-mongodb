

export const parseCookies = (req) => {
  const { refreshToken } = req.cookies;
  return {
    refreshToken,
  };
};
