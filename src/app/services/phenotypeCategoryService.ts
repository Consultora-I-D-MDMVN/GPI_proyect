import prisma from '@/utils/prisma';

export interface PhenotypeCategorySummary {
  id: number;
  label: string;
  traits: string[];
  prs_count: number;
}

export const getPhenotypeCategories = async (): Promise<PhenotypeCategorySummary[]> => {
  try {
    const traitCategories = await prisma.traitCategory.findMany({
      include: {
        traits: {
          select: {
            trait: {
              select: {
                efoId: true,
                _count: {
                  select: {
                    prsModels: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const categoriesSummary: PhenotypeCategorySummary[] = traitCategories.map((category) => {
      const traitIds = new Set<string>();
      let prsCount = 0;

      category.traits.forEach((traitToCategory) => {
        if (traitToCategory.trait.efoId) {
          traitIds.add(traitToCategory.trait.efoId);
        }
        prsCount += traitToCategory.trait._count.prsModels;
      });

      return {
        id: category.id,
        label: category.label,
        traits: Array.from(traitIds),
        prs_count: prsCount,
      };
    });

    return categoriesSummary;
  } catch (error) {
    console.error("Error fetching phenotype categories with counts:", error);
    throw new Error("Could not fetch phenotype categories with counts from the database.");
  }
};
