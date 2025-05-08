import type { NextApiRequest, NextApiResponse } from 'next';
import { getTraitsWithEfoId } from '../services/SelectEFOtraitsServices';

export const handleGetTraitsWithEfoId = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const traits = await getTraitsWithEfoId();

    const grouped = traits.reduce(
      (
        acc: Record<number, { id: number; efoId: string | null }[]>,
        trait: {
          id: number;
          efoId: string | null;
          categories: { traitCategory: { id: number } }[];
        }
      ) => {
        const categoryIds = trait.categories.map(cat => cat.traitCategory.id);
        categoryIds.forEach(catId => {
          if (!acc[catId]) acc[catId] = [];
          acc[catId].push({
            id: trait.id,
            efoId: trait.efoId,
          });
        });
        return acc;
      },
      {}
    );

    res.status(200).json(grouped);
  } catch (error) {
    console.error('Error en TraitController:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
