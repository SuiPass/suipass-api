const middleware = require('../../base/middleware');
const { db } = require('../../base/firebase');

module.exports = middleware(true, async ({ walletAddress, query, httpRes }) => {
  const input = query;
  console.log(query);

  const currentDoc = await db
    .collection('requests')
    .doc(walletAddress)
    .collection('items')
    .where('provider', '=', query.provider)
    .where('isApproved', '=', false)
    .get();

  const records = currentDoc.docs.map((doc) => doc.data());

  return httpRes.status(201).json({
    data: records
  });
});
