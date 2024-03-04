const middleware = require('../../base/middleware');
const githubProvider = require('../../app/providers/github');

module.exports = middleware(async (request, response) => {
  const input = request.body;
  const output = await githubProvider.verify(input);

  return response.json({
    data: output
  });
});
