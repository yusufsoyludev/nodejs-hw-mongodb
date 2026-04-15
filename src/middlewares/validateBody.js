export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: 'Validaton error',
      data: error.detail.map((err) => err.message),
    });
  }
};
