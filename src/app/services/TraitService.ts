
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
        label: true,
      },
    });

    // Extraer solo los nombres (labels) y devolverlos como array de strings
    return traits.map(trait => trait.label);
  } catch (error) {
    console.error('Error en TraitService:', error);
    throw new Error('Error obteniendo traits por categoría.');
  }
};