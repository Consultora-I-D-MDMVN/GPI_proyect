import type { NextApiRequest, NextApiResponse } from 'next';
import { handleGetTraitsByCategory, TraitsByCategoryResponseData } from '@/app/controllers/traitByCategoryController';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TraitsByCategoryResponseData>
) {
  // Check the HTTP method
  if (req.method === 'GET') {
    // Delegate the request handling to the controller function
    await handleGetTraitsByCategory(req, res);
  } else {
    // Handle any methods other than GET
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
