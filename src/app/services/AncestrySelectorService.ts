import prisma from '@/utils/prisma';

export const getPrsModelsByAncestry = async (ancestryLabelOrSymbol: string) => {
  const ancestry = await prisma.broadAncestryCategory.findFirst({
    where: {
      OR: [
        { label: ancestryLabelOrSymbol },
        { symbol: ancestryLabelOrSymbol }
      ]
    },
    include: {
      broadAncestryInModels: {
        include: {
          prsModel: {
            include: {
              broadAncestryCategories: {
                include: {
                  broadAncestryCategory: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!ancestry) return [];

  return ancestry.broadAncestryInModels.map((item) => item.prsModel);
};