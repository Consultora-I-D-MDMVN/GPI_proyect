// Mock Prisma before any imports
jest.mock('@/utils/prisma', () => ({
  __esModule: true,
  default: {
    traitCategory: {
      findMany: jest.fn(),
    },
    pRSModel: {
      findMany: jest.fn(),
    },
  },
}));

import { getTraitCategoriesWithCounts } from '../app/services/traitCategoryService';
import prisma from '@/utils/prisma';

// Type the mocks properly
const mockFindMany = prisma.traitCategory.findMany as jest.MockedFunction<typeof prisma.traitCategory.findMany>;
const mockPRSModelFindMany = prisma.pRSModel.findMany as jest.MockedFunction<typeof prisma.pRSModel.findMany>;

describe('TraitCategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTraitCategoriesWithCounts', () => {
    describe('without broadAncestryIds (original behavior)', () => {
      it('should return categories with PRS model IDs in traits field', async () => {
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
                    { prsModelId: 101 },
                    { prsModelId: 102 }
                  ]
                }
              },
              {
                trait: {
                  id: 2,
                  prsModels: [
                    { prsModelId: 101 },
                    { prsModelId: 103 }
                  ]
                }
              }
            ]
          }
        ];

        mockFindMany.mockResolvedValue(mockData as any);

        // Act - call the function without broadAncestryIds
        const result = await getTraitCategoriesWithCounts();

        // Assert - check the results
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          id: 1,
          name: 'Physical Traits',
          traits: [101, 102, 103], // PRS model IDs, not trait IDs
          pgss: 3 // unique PRS models: 101, 102, 103
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

        mockFindMany.mockResolvedValue(mockData as any);

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
    });

    describe('with broadAncestryIds (filtered behavior)', () => {
      it('should return filtered categories based on ancestry IDs', async () => {
        // Arrange - mock developed PRS models
        const mockDevelopedPrsModels = [
          { id: 101 },
          { id: 102 }
        ];

        // Mock evaluated PRS models
        const mockEvaluatedPrsModels = [
          { id: 102 },
          { id: 103 }
        ];

        // Mock trait categories
        const mockTraitCategories = [
          {
            id: 1,
            label: 'Physical Traits',
            traits: [
              {
                trait: {
                  id: 1,
                  prsModels: [
                    { prsModelId: 101 },
                    { prsModelId: 104 } // Este no está en las listas válidas
                  ]
                }
              },
              {
                trait: {
                  id: 2,
                  prsModels: [
                    { prsModelId: 102 },
                    { prsModelId: 103 }
                  ]
                }
              }
            ]
          }
        ];

        // Setup mocks
        mockPRSModelFindMany
          .mockResolvedValueOnce(mockDevelopedPrsModels as any) // First call for developed models
          .mockResolvedValueOnce(mockEvaluatedPrsModels as any); // Second call for evaluated models

        mockFindMany.mockResolvedValue(mockTraitCategories as any);

        // Act - call with broadAncestryIds
        const result = await getTraitCategoriesWithCounts([58, 59]);

        // Assert
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          id: 1,
          name: 'Physical Traits',
          traits: [101, 102, 103], // Only valid PRS model IDs
          pgss: 3
        });

        // Verify the correct calls were made
        expect(mockPRSModelFindMany).toHaveBeenCalledTimes(2);
        expect(mockFindMany).toHaveBeenCalledTimes(1);
      });

      it('should return empty traits when no valid PRS models found', async () => {
        // Arrange
        mockPRSModelFindMany
          .mockResolvedValueOnce([]) // No developed models
          .mockResolvedValueOnce([]); // No evaluated models

        const mockTraitCategories = [
          {
            id: 1,
            label: 'Test Category',
            traits: [
              {
                trait: {
                  id: 1,
                  prsModels: [
                    { prsModelId: 999 } // Not in valid list
                  ]
                }
              }
            ]
          }
        ];

        mockFindMany.mockResolvedValue(mockTraitCategories as any);

        // Act
        const result = await getTraitCategoriesWithCounts([58]);

        // Assert
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          id: 1,
          name: 'Test Category',
          traits: [], // No valid PRS models
          pgss: 0
        });
      });
    });

    it('should throw error when database fails', async () => {
      // Arrange
      const errorMessage = 'Database connection failed';
      mockFindMany.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(getTraitCategoriesWithCounts()).rejects.toThrow('Could not fetch trait categories with counts from the database.');
    });
  });
});
