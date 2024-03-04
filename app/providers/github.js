const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
const { default: axios } = require('axios');

module.exports = {
  verify: async (input) => {
    const { authorizationCode } = input;

    const res = await axios.post(
      `https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${authorizationCode}`,
      undefined,
      {
        headers: {
          accept: 'application/json'
        }
      }
    );

    const accessToken = res.data.access_token;

    const output = {
      accessToken
    };

    return output;
  }
};
