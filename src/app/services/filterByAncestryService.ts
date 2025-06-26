import { prisma } from '@/utils/prisma';

export const getPRSModelsByAncestry = async (broadAncestryId: number) => {
  return await prisma.pRSModel.findMany({
    where: {
      broadAncestryCategories: {
        some: {
          broadAncestryId: broadAncestryId,
        },
      },
    },
    select: {
      id: true,
      name: true,
      pgscId: true,
      pgscURL: true,
      broadAncestryCategories: {
        where: {
          broadAncestryId: broadAncestryId,
        },
        select: {
          percentage: true,
          broadAncestryCategory: {
            select: {
              label: true,
              symbol: true,
            },
          },
        },
      },
    },
  });
};
