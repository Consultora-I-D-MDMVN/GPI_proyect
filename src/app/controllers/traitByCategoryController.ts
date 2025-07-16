import type { NextApiRequest, NextApiResponse } from 'next';
import { getTraitsByCategoryId, TraitSummary } from '@/app/services/traitByCategoryService';

// Define the response data type
export interface TraitsByCategoryResponseData {
  traits?: TraitSummary[];
  error?: string;
}

/**
 * Handles GET requests for traits by trait category ID.
 * Expects the trait category ID as a query parameter 'categoryId'.
 * @param req The NextApiRequest object.
 * @param res The NextApiResponse object.
 */
export const handleGetTraitsByCategory = async (
  req: NextApiRequest,
  res: NextApiResponse<TraitsByCategoryResponseData>
): Promise<void> => {
  const { categoryId, broadAncestryIds } = req.query;

  if (!categoryId || typeof categoryId !== 'string') {
    res.status(400).json({ error: 'Missing or invalid trait category ID' });
    return;
  }

  const traitCategoryId = parseInt(categoryId, 10);

  if (isNaN(traitCategoryId)) {
    res.status(400).json({ error: 'Invalid trait category ID' });
    return;
  }

  // Parsear broadAncestryIds si está presente
  let ancestryIds: number[] = [];
  if (broadAncestryIds) {
    if (typeof broadAncestryIds === 'string') {
      // Si es una cadena, dividir por comas y convertir a números
      ancestryIds = broadAncestryIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));
    } else if (Array.isArray(broadAncestryIds)) {
      // Si es un array, convertir cada elemento a número
      ancestryIds = broadAncestryIds.map(id => parseInt(String(id), 10)).filter(id => !isNaN(id));
    }
  }

  try {
    const traits = await getTraitsByCategoryId(traitCategoryId, ancestryIds);
    res.status(200).json({ traits });
  } catch (error) {
    console.error(`API Controller Error fetching traits for category ${traitCategoryId}:`, error);
    res.status(500).json({ error: `Failed to fetch traits for category ${traitCategoryId}` });
  }
};
