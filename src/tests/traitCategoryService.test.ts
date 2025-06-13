// Mock Prisma before any imports
jest.mock('@/utils/prisma', () => ({
  __esModule: true,
  default: {
    traitCategory: {
      findMany: jest.fn(),
    },
  },
}));

import { getTraitCategoriesWithCounts } from '../app/services/traitCategoryService';
import prisma from '@/utils/prisma';

// Get the mocked version with proper typing
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('TraitCategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTraitCategoriesWithCounts', () => {
    it('should return categories with trait counts and PRS model counts', async () => {
      // Arrange - setup mock data
      const mockData = [
        {
          id: 1,
          label: 'Physical Traits',
          traits: [
            {
              trait: {
                id: 1,
                prsModels: [
                  { prsModelId: 1 },
                  { prsModelId: 2 }
                ]
              }
            },
            {
              trait: {
                id: 2,
                prsModels: [
                  { prsModelId: 1 },
                  { prsModelId: 3 }
                ]
              }
            }
          ]
        }
      ];

      mockPrisma.traitCategory.findMany.mockResolvedValue(mockData);

      // Act - call the function
      const result = await getTraitCategoriesWithCounts();

      // Assert - check the results
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        name: 'Physical Traits',
        traits: [1, 2],
        pgss: 3 // unique PRS models: 1, 2, 3
      });
    });

    it('should handle empty categories', async () => {
      // Arrange
      const mockData = [
        {
          id: 1,
          label: 'Empty Category',
          traits: []
        }
      ];

      mockPrisma.traitCategory.findMany.mockResolvedValue(mockData);

      // Act
      const result = await getTraitCategoriesWithCounts();

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 1,
        name: 'Empty Category',
        traits: [],
        pgss: 0
      });
    });

    it('should throw error when database fails', async () => {
      // Arrange
      const errorMessage = 'Database connection failed';
      mockPrisma.traitCategory.findMany.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(getTraitCategoriesWithCounts()).rejects.toThrow('Could not fetch trait categories with counts from the database.');
    });
  });
});
