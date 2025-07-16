import prisma from '@/utils/prisma';

export interface TraitCategorySummary {
  id: number;
  name: string;
  traits: number[];
  pgss: number;
}

export const getTraitCategoriesWithCounts = async (broadAncestryIds: number[] = []): Promise<TraitCategorySummary[]> => {
  try {
    // Si no se proporcionan ancestrías, usar comportamiento original
    if (broadAncestryIds.length === 0) {
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
          traits: Array.from(prsModelIds), // Lista de PRS model IDs como dice la actualización
          pgss: prsModelIds.size,
        };
      });

      return categoriesSummary;
    }

    // Lista 1: PRSModels desarrollados con las BroadAncestryCategories especificadas
    const developedPrsModels = await prisma.pRSModel.findMany({
      where: {
        broadAncestryCategories: {
          some: {
            broadAncestryCategory: {
              id: { in: broadAncestryIds }
            }
          }
        }
      },
      select: { id: true }
    });

    // Lista 2: PRSModels evaluados con las BroadAncestryCategories especificadas
    const evaluatedPrsModels = await prisma.pRSModel.findMany({
      where: {
        modelEvaluations: {
          some: {
            evaluationPopulationSample: {
              broadAncestryCategory: {
                id: { in: broadAncestryIds }
              }
            }
          }
        }
      },
      select: { id: true }
    });

    // Combinar ambas listas en un Set para evitar duplicados
    const validPrsModelIds = new Set([
      ...developedPrsModels.map(model => model.id),
      ...evaluatedPrsModels.map(model => model.id)
    ]);

    // Obtener todas las trait categories con sus relaciones
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
      const filteredPrsModelIds = new Set<number>();

      category.traits.forEach((traitToCategory: any) => {
        traitIds.add(traitToCategory.trait.id);
        // Solo contar PRSModels que están en las listas válidas
        traitToCategory.trait.prsModels.forEach((prsModelToTrait: any) => {
          if (validPrsModelIds.has(prsModelToTrait.prsModelId)) {
            filteredPrsModelIds.add(prsModelToTrait.prsModelId);
          }
        });
      });

      return {
        id: category.id,
        name: category.label,
        traits: Array.from(filteredPrsModelIds), // Lista de PRS model IDs como dice la actualización
        pgss: filteredPrsModelIds.size,
      };
    });

    return categoriesSummary;
  } catch (error) {
    console.error("Error fetching trait categories with counts:", error);
    throw new Error("Could not fetch trait categories with counts from the database.");
  }
};
