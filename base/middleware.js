const RuntimeError = require('./runtime-error');

const middleware = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error(err);

      if (err instanceof RuntimeError) {
        res.status(err.code ?? 500).json({ error: err.message ?? 'INTERNAL_SERVER_ERROR' });
      } else {
        res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
      }
    }
  };
};

module.exports = middleware;
