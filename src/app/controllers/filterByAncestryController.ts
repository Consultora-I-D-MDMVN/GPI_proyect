import type { NextApiRequest, NextApiResponse } from 'next';
import { getPRSModelsByAncestry } from '@/app/services/filterByAncestryService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { broadAncestryId } = req.query;

  if (!broadAncestryId || isNaN(Number(broadAncestryId))) {
    return res.status(400).json({ message: 'Debe proporcionar un broadAncestryId válido.' });
  }

  try {
    const models = await getPRSModelsByAncestry(Number(broadAncestryId));
    return res.status(200).json(models);
  } catch (error) {
    console.error('Error al filtrar modelos por ancestría:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}
