import prisma from '@/utils/prisma';

export interface TraitCategorySummary {
  id: number;
  name: string;
  traits: number[];
  pgss: number;
}

export const getTraitCategoriesWithCounts = async (): Promise<TraitCategorySummary[]> => {
  try {
    const traitCategories = await prisma.traitCategory.findMany({
      include: {
        traits: {
          include: {
            trait: {
              include: {
                prsModels: {
                  include: {
                    prsModel: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const categoriesSummary: TraitCategorySummary[] = traitCategories.map((category: any) => {
      const traitIds = new Set<number>();
      const prsModelIds = new Set<number>();

      category.traits.forEach((traitToCategory: any) => {
        traitIds.add(traitToCategory.trait.id);
        traitToCategory.trait.prsModels.forEach((prsModelToTrait: any) => {
          prsModelIds.add(prsModelToTrait.prsModelId);
        });
      });

      return {
        id: category.id,
        name: category.label,
        traits: Array.from(traitIds),
        pgss: prsModelIds.size,
      };
    });

    return categoriesSummary;
  } catch (error) {
    console.error("Error fetching trait categories with counts:", error);
    throw new Error("Could not fetch trait categories with counts from the database.");
  }
};
