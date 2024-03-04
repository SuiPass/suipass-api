import { VercelRequest, VercelResponse } from '@vercel/node';
import { GithubService } from '../../app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const input = req.body;

  await GithubService.verify(input);

  return res.status(201).end();
}
