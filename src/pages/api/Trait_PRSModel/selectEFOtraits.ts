import type { NextApiRequest, NextApiResponse } from 'next';
import { handleGetTraitIdsWithEfoId } from '../../../app/controllers/SelectEFOtraits'; // ajusta la ruta según tu estructura real

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await handleGetTraitIdsWithEfoId(req, res);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: 'Método no permitido' });
  }
}