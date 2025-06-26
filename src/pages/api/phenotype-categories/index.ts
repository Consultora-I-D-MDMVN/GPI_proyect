import type { NextApiRequest, NextApiResponse } from 'next';
import { handleGetPhenotypeCategories } from '@/app/controllers/phenotypeCategoryController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await handleGetPhenotypeCategories(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
