import prisma from '@/utils/prisma';

export const getPrsModelsByTraits = async (traitIds: number[]) => {
  try {
    // Validación básica
    if (!traitIds.length) {
      throw new Error('Se requiere al menos un trait para la búsqueda');
    }

    // Consulta a la tabla intermedia (pRSModelToTrait) para obtener los modelos PRS relacionados
    const prsModelsRelations = await prisma.pRSModelToTrait.findMany({
      where: {
        traitId: {
          in: traitIds,
        }
      },
      include: {
        prsModel: true, 
        trait: true,     
      }
    });

    // Mapear los resultados a los modelos PRS
    const prsModels = prsModelsRelations.map((relation: { prsModel: any }) => relation.prsModel);

    return prsModels;
  } catch (error: any) {
    console.error('Service Error fetching PRS models by traits:', error);
    // Si el error es el de validación, relánzalo tal cual
    if (error.message === 'Se requiere al menos un trait para la búsqueda') {
      throw error;
    }
    // Si es otro error, lanza el mensaje genérico
    throw new Error('Failed to retrieve PRS models associated with selected traits.');
  }
};