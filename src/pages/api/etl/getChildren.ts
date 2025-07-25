import type { NextApiRequest, NextApiResponse } from 'next';
import { handleGetTraitsByCategory } from '@/app/controllers/traitController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await handleGetTraitsByCategory(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Método ${req.method} no permitido.` });
  }
}
