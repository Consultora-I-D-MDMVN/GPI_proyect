import type { NextApiRequest, NextApiResponse } from 'next';
import { getPhenotypeCategories, PhenotypeCategorySummary } from '@/app/services/phenotypeCategoryService';

export interface PhenotypeCategoryResponseData {
  categories?: PhenotypeCategorySummary[];
  error?: string;
}

export const handleGetPhenotypeCategories = async (
  req: NextApiRequest,
  res: NextApiResponse<PhenotypeCategoryResponseData>
): Promise<void> => {
  try {
    const categories = await getPhenotypeCategories();
    res.status(200).json({ categories });
  } catch (error) {
    console.error("API Controller Error fetching phenotype categories:", error);
    res.status(500).json({ error: 'Failed to fetch phenotype categories' });
  }
};
