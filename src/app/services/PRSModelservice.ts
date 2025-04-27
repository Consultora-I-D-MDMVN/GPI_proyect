import prisma from '@/utils/prisma';

export const getPrsModelsByTraits = async (traitIds: number[]) => {
  try {
    // Validación básica
    if (!traitIds.length) {
      throw new Error('Se requiere al menos un trait para la búsqueda');
    }

    // Consulta a la tabla intermedia (PRSModelToTrait) para obtener los modelos PRS relacionados
    const prsModelsRelations = await prisma.PRSModelToTrait.findMany({
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
    const prsModels = prsModelsRelations.map((relation) => relation.prsModel);

    return prsModels;
  } catch (error) {
    console.error('Service Error fetching PRS models by traits:', error);
    throw new Error('Failed to retrieve PRS models associated with selected traits.');
  }
};