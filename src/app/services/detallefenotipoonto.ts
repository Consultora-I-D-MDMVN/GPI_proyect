import prisma from '@/utils/prisma';

export const getTraitDetails = async (traitId: number) => {
  return await prisma.trait.findUnique({
    where: { id: traitId },
    include: {
      categories: {
        include: {
          traitCategory: true
        }
      }
    },
  });
};
