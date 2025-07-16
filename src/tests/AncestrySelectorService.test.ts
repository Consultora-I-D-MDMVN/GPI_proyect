// Mock Prisma antes de importar el servicio
jest.mock('@/utils/prisma', () => ({
  __esModule: true,
  default: {
    broadAncestryCategory: {
      findFirst: jest.fn(),
    },
  },
}));

import { getPrsModelsByAncestry } from '../app/services/AncestrySelectorService';
import prisma from '@/utils/prisma';

const mockFindFirst = prisma.broadAncestryCategory.findFirst as jest.MockedFunction<typeof prisma.broadAncestryCategory.findFirst>;

describe('AncestrySelectorService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPrsModelsByAncestry', () => {
    it('debería retornar modelos PRS relacionados a la ancestry', async () => {
      // Arrange
      const ancestryLabel = 'EUR';
      const mockAncestry = {
        broadAncestryInModels: [
          { prsModel: { id: 1, name: 'PRS1' } },
          { prsModel: { id: 2, name: 'PRS2' } },
        ],
      };
      mockFindFirst.mockResolvedValue(mockAncestry as any);

      // Act
      const result = await getPrsModelsByAncestry(ancestryLabel);

      // Assert
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { label: ancestryLabel },
            { symbol: ancestryLabel },
          ],
        },
        include: {
          broadAncestryInModels: {
            include: {
              prsModel: {
                include: {
                  broadAncestryCategories: {
                    include: {
                      broadAncestryCategory: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      expect(result).toEqual([
        { id: 1, name: 'PRS1' },
        { id: 2, name: 'PRS2' },
      ]);
    });

    it('debería retornar un array vacío si no se encuentra la ancestry', async () => {
      mockFindFirst.mockResolvedValue(null);
      const result = await getPrsModelsByAncestry('NO_EXISTE');
      expect(result).toEqual([]);
    });

    it('debería manejar errores de base de datos', async () => {
      mockFindFirst.mockRejectedValue(new Error('DB error'));
      await expect(getPrsModelsByAncestry('EUR')).rejects.toThrow();
    });
  });
});
