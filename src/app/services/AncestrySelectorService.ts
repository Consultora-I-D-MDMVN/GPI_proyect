import prisma from '@/utils/prisma';

export const getPrsModelsByAncestry = async (ancestryLabel: string) => {
  const prsModels = await prisma.pRSModel.findMany({
    where: {
      broadAncestryCategories: {
        some: {
          broadAncestryCategory: {
            label: ancestryLabel,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      numberOfSNP: true,
      pgscId: true,
      pgscURL: true,
      publicationId: true,
      broadAncestryCategories: {
        select: {
          broadAncestryCategory: {
            select: {
              id: true,
              label: true,
            },
          },
        },
      },
    },
  });

  return prsModels;
};
