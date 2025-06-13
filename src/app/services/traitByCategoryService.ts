import prisma from '@/utils/prisma';

export interface TraitSummary {
  id: number;
  name: string;
  pgss: number;
  description: string | null;
  URL: string | null;
  onto_id: string | null;
}

export const getTraitsByCategoryId = async (traitCategoryId: number): Promise<TraitSummary[]> => {
  try {
    const traitCategory = await prisma.traitCategory.findUnique({
      where: { id: traitCategoryId },
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

    if (!traitCategory) {
      return [];
    }

    const traitsSummary: TraitSummary[] = traitCategory.traits.map(traitToCategory => {
      const trait = traitToCategory.trait;
      const prsModelIds = new Set<number>();

      trait.prsModels.forEach(prsModelToTrait => {
        prsModelIds.add(prsModelToTrait.prsModelId);
      });

      const ontoId = trait.efoId || trait.mondoId || trait.hpoId || trait.orphaId;

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
  } catch (error) {
    console.error(`Error fetching traits for category ${traitCategoryId}:`, error);
    throw new Error(`Could not fetch traits for category ${traitCategoryId} from the database.`);
  }
};
