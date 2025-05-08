import prisma from '@/utils/prisma';

export const getTraitsWithEfoId = async () => {
  try {
    const traits = await prisma.trait.findMany({
      where: {
        efoId: {
          not: null,
        },
      },
      select: {
        id: true,
        efoId: true,
        categories: {
          select: {
            traitCategory: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    return traits;
  } catch (error) {
    console.error('Error en SelectEFOtraitServices:', error);
    throw new Error('Error obteniendo traits con efoId.');
  }
};
