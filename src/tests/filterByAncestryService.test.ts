import { getPRSModelsByAncestry } from '../app/services/filterByAncestryService';
import { prisma } from '@/utils/prisma';

jest.mock('@/utils/prisma', () => ({
  prisma: {
    pRSModel: {
      findMany: jest.fn(),
    },
  },
}));

describe('getPRSModelsByAncestry', () => {
  const mockResult = [
    {
      id: 1,
      name: 'Model 1',
      pgscId: 'PGSC001',
      pgscURL: 'http://example.com',
      broadAncestryCategories: [
        {
          percentage: 80,
          broadAncestryCategory: {
            label: 'EUR',
            symbol: '🇪🇺',
          },
        },
      ],
    },
  ];

  beforeEach(() => {
    (prisma.pRSModel.findMany as jest.Mock).mockResolvedValue(mockResult);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call prisma.pRSModel.findMany with correct params and return data', async () => {
    const broadAncestryId = 1;
    const result = await getPRSModelsByAncestry(broadAncestryId);

    expect(prisma.pRSModel.findMany).toHaveBeenCalledWith({
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
    expect(result).toEqual(mockResult);
  });
});