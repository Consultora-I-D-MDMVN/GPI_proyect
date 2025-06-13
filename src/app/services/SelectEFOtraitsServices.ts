import prisma from '@/utils/prisma';

type TraitWithId = { id: number };

export const getTraitIdsWithEfoId = async (efoIds: string[]): Promise<number[]> => {
  try {
    
    const traits: TraitWithId[] = await prisma.trait.findMany({
      where: {
        efoId: {
          in: efoIds,
        },
      },
      select: {
        id: true,
      },
    });

    return traits.map((trait) => trait.id);
  } catch (error) {
    console.error('Error en SelectEFOtraitServices:', error);
    throw new Error('Error obteniendo trait IDs con efoId.');
  }
};



