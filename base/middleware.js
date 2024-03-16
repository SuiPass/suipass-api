const RuntimeError = require('./runtime-error');

const isDevelopment = process.env.NODE_ENV !== 'production';

const middleware = (requireWalletAddress, handler) => {
  return async (req, res) => {
    try {
      const walletAddress = req.headers['x-wallet-address'];
      const query = req.query;
      const body = req.body;

      if (isDevelopment) {
        console.info('=================================================================');
        console.info('URL       ', req.url);
        console.info('ADDRESS   ', walletAddress);
        console.info('QUERY     ', query);
        console.info('BODY      ', body);
        console.info('=================================================================');
      }

      if (requireWalletAddress && !walletAddress) {
        res.status(401).json({ error: 'UNAUTHORIZE' });
        return;
      }

      await handler({ walletAddress, query, body, httpReq: req, httpRes: res });
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
