import type { NextApiRequest, NextApiResponse } from 'next';
import { getTraitsByCategory } from '@/app/services/TraitService';

export const handleGetTraitsByCategory = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { traitCategoryId } = req.query;

    if (!traitCategoryId) {
      return res.status(400).json({ error: 'Debes proporcionar un traitCategoryId válido.' });
    }

    const traits = await getTraitsByCategory(parseInt(traitCategoryId as string, 10));
    res.status(200).json(traits);

  } catch (error) {
    console.error('Error en TraitController:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
