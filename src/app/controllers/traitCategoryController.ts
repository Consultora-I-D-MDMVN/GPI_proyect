import type { NextApiRequest, NextApiResponse } from 'next';
import { getTraitCategoriesWithCounts, TraitCategorySummary } from '@/app/services/traitCategoryService';

export interface TraitCategoryResponseData {
  categories?: TraitCategorySummary[];
  error?: string;
}

export const handleGetTraitCategories = async (
  req: NextApiRequest,
  res: NextApiResponse<TraitCategoryResponseData>
): Promise<void> => {
  try {
    // Extraer broadAncestryIds del query string
    const { broadAncestryIds } = req.query;
    let ancestryIds: number[] = [];

    // Parsear broadAncestryIds si está presente
    if (broadAncestryIds) {
      if (typeof broadAncestryIds === 'string') {
        // Si es una cadena, dividir por comas y convertir a números
        ancestryIds = broadAncestryIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
      } else if (Array.isArray(broadAncestryIds)) {
        // Si es un array, convertir cada elemento a número
        ancestryIds = broadAncestryIds.map(id => parseInt(String(id), 10)).filter(id => !isNaN(id));
      }
    }

    const categories = await getTraitCategoriesWithCounts(ancestryIds);
    res.status(200).json({ categories });
  } catch (error) {
    console.error("API Controller Error fetching trait categories:", error);
    res.status(500).json({ error: 'Failed to fetch trait categories' });
  }
};
