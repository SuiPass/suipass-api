const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

module.exports = {
  verify: async (input) => {
    console.log(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);
    return 'githubbb';
  }
};
