import type { NextApiRequest, NextApiResponse } from 'next';
import { handleGetTraitDetails } from '@/app/controllers/detallefenotipoonto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await handleGetTraitDetails(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Método ${req.method} no permitido.` });
  }
}
