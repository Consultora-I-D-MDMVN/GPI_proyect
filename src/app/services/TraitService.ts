// src/app/services/TraitService.ts

import prisma from '@/utils/prisma';

export const getTraitsByCategory = async (traitCategoryId: number) => {
  try {
    const traits = await prisma.trait.findMany({
      where: {
        categories: {
          some: {
            traitCategoryId,
          },
        },
      },
      select: {
        id: true,
        label: true,
        description: true,
        URL: true,
      },
    });

    return traits;
  } catch (error) {
    console.error('Error en TraitService:', error);
    throw new Error('Error obteniendo traits por categoría.');
  }
};
