const middleware = require('../../base/middleware');
const { db } = require('../../base/firebase');

module.exports = middleware(true, async ({ walletAddress, body, httpRes }) => {
  const input = body;

  const currentDoc = await db
    .collection('requests')
    .doc(walletAddress)
    .collection('items')
    .where('provider', '=', body.provider)
    .where('isApproved', '=', false)
    .limit(1)
    .get();

  if (currentDoc.docs.length) {
    return httpRes.status(400).json({
      error: 'Request is exists!'
    });
  }

  const newDoc = db.collection('requests').doc(walletAddress).collection('items').doc();

  const record = {
    provider: input.provider,
    proof: input.proof,
    isApproved: false,
    createdAt: new Date()
  };
  await newDoc.set(record);

  return httpRes.status(201).send();
});
