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
    const categories = await getTraitCategoriesWithCounts();
    res.status(200).json({ categories });
  } catch (error) {
    console.error("API Controller Error fetching trait categories:", error);
    res.status(500).json({ error: 'Failed to fetch trait categories' });
  }
};
