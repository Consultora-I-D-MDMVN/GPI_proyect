import type { NextApiRequest, NextApiResponse } from 'next';
import { handleGetTraitCategories, TraitCategoryResponseData } from '@/app/controllers/traitCategoryController';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TraitCategoryResponseData>
) {
  if (req.method === 'GET') {
    await handleGetTraitCategories(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
