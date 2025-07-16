import prisma from '@/utils/prisma';

export interface TraitSummary {
  id: number;
  name: string;
  pgss: number;
  description: string | null;
  URL: string | null;
  onto_id: string | null;
}

export const getTraitsByCategoryId = async (
  traitCategoryId: number, 
  broadAncestryIds: number[] = []
): Promise<TraitSummary[]> => {
  try {
    // Si no se proporcionan ancestrías, usar comportamiento original
    if (broadAncestryIds.length === 0) {
      const traitCategory = await prisma.traitCategory.findUnique({
        where: { id: traitCategoryId },
        include: {
          traits: {
            include: {
              trait: {
                select: {
                  id: true,
                  label: true,
                  description: true,
                  URL: true,
                  efoId: true,
                  mondoId: true,
                  hpoId: true,
                  orphaId: true,
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

      if (!traitCategory) {
        return [];
      }

      const traitsSummary: TraitSummary[] = traitCategory.traits.map(traitToCategory => {
        const trait = traitToCategory.trait;
        const prsModelIds = new Set<number>();

        trait.prsModels.forEach(prsModelToTrait => {
          prsModelIds.add(prsModelToTrait.prsModelId);
        });

        const ontoId = (trait as any).efoId || (trait as any).mondoId || (trait as any).hpoId || (trait as any).orphaId || (trait as any).otherId;

        return {
          id: trait.id,
          name: trait.label,
          pgss: prsModelIds.size,
          description: trait.description,
          URL: trait.URL,
          onto_id: ontoId,
        };
      });

      return traitsSummary;
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

    // Obtener los traits de la categoría especificada
    const traitCategory = await prisma.traitCategory.findUnique({
      where: { id: traitCategoryId },
      include: {
        traits: {
          include: {
            trait: {
              select: {
                id: true,
                label: true,
                description: true,
                URL: true,
                efoId: true,
                mondoId: true,
                hpoId: true,
                orphaId: true,
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

    if (!traitCategory) {
      return [];
    }

    const traitsSummary: TraitSummary[] = traitCategory.traits.map(traitToCategory => {
      const trait = traitToCategory.trait;
      const filteredPrsModelIds = new Set<number>();

      // Solo contar PRSModels que están en las listas válidas
      trait.prsModels.forEach(prsModelToTrait => {
        if (validPrsModelIds.has(prsModelToTrait.prsModelId)) {
          filteredPrsModelIds.add(prsModelToTrait.prsModelId);
        }
      });

      const ontoId = (trait as any).efoId || (trait as any).mondoId || (trait as any).hpoId || (trait as any).orphaId || (trait as any).otherId;

      return {
        id: trait.id,
        name: trait.label,
        pgss: filteredPrsModelIds.size,
        description: trait.description,
        URL: trait.URL,
        onto_id: ontoId,
      };
    });

    return traitsSummary;
  } catch (error) {
    console.error(`Error fetching traits for category ${traitCategoryId}:`, error);
    throw new Error(`Could not fetch traits for category ${traitCategoryId} from the database.`);
  }
};
