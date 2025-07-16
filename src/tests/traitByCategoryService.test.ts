// Mock Prisma before any imports
jest.mock('@/utils/prisma', () => ({
  __esModule: true,
  default: {
    traitCategory: {
      findUnique: jest.fn(),
    },
    pRSModel: {
      findMany: jest.fn(),
    },
  },
}));

import { getTraitsByCategoryId, TraitSummary } from '../app/services/traitByCategoryService';
import prisma from '@/utils/prisma';

// Type the mocks properly
const mockTraitCategoryFindUnique = prisma.traitCategory.findUnique as jest.MockedFunction<typeof prisma.traitCategory.findUnique>;
const mockPRSModelFindMany = prisma.pRSModel.findMany as jest.MockedFunction<typeof prisma.pRSModel.findMany>;

describe('TraitByCategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTraitsByCategoryId', () => {
    describe('without broadAncestryIds (original behavior)', () => {
      it('should return traits for a category without filtering', async () => {
        // Arrange - setup mock data
        const mockTraitCategory = {
          id: 1,
          traits: [
            {
              trait: {
                id: 1,
                label: 'Height',
                description: 'Human height measurement',
                URL: 'http://example.com/height',
                efoId: 'EFO_123',
                mondoId: null,
                hpoId: null,
                orphaId: null,
                prsModels: [
                  { prsModel: { id: 101 }, prsModelId: 101 },
                  { prsModel: { id: 102 }, prsModelId: 102 }
                ]
              }
            },
            {
              trait: {
                id: 2,
                label: 'Weight',
                description: 'Body weight measurement',
                URL: 'http://example.com/weight',
                efoId: null,
                mondoId: 'MONDO_456',
                hpoId: null,
                orphaId: null,
                prsModels: [
                  { prsModel: { id: 103 }, prsModelId: 103 }
                ]
              }
            }
          ]
        };

        mockTraitCategoryFindUnique.mockResolvedValue(mockTraitCategory as any);

        // Act - call the function without broadAncestryIds
        const result = await getTraitsByCategoryId(1);

        // Assert - check the results
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({
          id: 1,
          name: 'Height',
          pgss: 2, // 2 unique PRS models
          description: 'Human height measurement',
          URL: 'http://example.com/height',
          onto_id: 'EFO_123' // First non-null onto ID
        });
        expect(result[1]).toEqual({
          id: 2,
          name: 'Weight',
          pgss: 1, // 1 unique PRS model
          description: 'Body weight measurement',
          URL: 'http://example.com/weight',
          onto_id: 'MONDO_456' // First non-null onto ID
        });

        // Verify the correct query was made
        expect(mockTraitCategoryFindUnique).toHaveBeenCalledWith({
          where: { id: 1 },
          include: {
            traits: {
              include: {
                trait: {
                  select: {
                    id: true,
                    label: true,
                    description: true,
                    URL: true,
                    efoId: true,
                    mondoId: true,
                    hpoId: true,
                    orphaId: true,
                    prsModels: {
                      include: {
                        prsModel: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
      });

      it('should handle traits with null/undefined optional fields', async () => {
        // Arrange
        const mockTraitCategory = {
          id: 1,
          traits: [
            {
              trait: {
                id: 1,
                label: 'Height',
                description: null,
                URL: null,
                efoId: null,
                mondoId: null,
                hpoId: null,
                orphaId: null,
                prsModels: []
              }
            }
          ]
        };

        mockTraitCategoryFindUnique.mockResolvedValue(mockTraitCategory as any);

        // Act
        const result = await getTraitsByCategoryId(1);

        // Assert
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
          id: 1,
          name: 'Height',
          pgss: 0, // No PRS models
          description: null,
          URL: null,
          onto_id: undefined // All onto IDs are null, so returns undefined
        });
      });

      it('should return empty array when trait category not found', async () => {
        // Arrange
        mockTraitCategoryFindUnique.mockResolvedValue(null);

        // Act
        const result = await getTraitsByCategoryId(999);

        // Assert
        expect(result).toEqual([]);
      });
    });

    describe('with broadAncestryIds (filtered behavior)', () => {
      it('should return filtered traits based on ancestry IDs', async () => {
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

        // Mock trait category
        const mockTraitCategory = {
          id: 1,
          traits: [
            {
              trait: {
                id: 1,
                label: 'Height',
                description: 'Human height measurement',
                URL: 'http://example.com/height',
                efoId: 'EFO_123',
                mondoId: null,
                hpoId: null,
                orphaId: null,
                prsModels: [
                  { prsModel: { id: 101 }, prsModelId: 101 },
                  { prsModel: { id: 104 }, prsModelId: 104 } // Este no está en las listas válidas
                ]
              }
            },
            {
              trait: {
                id: 2,
                label: 'Weight',
                description: 'Body weight measurement', 
                URL: 'http://example.com/weight',
                efoId: null,
                mondoId: 'MONDO_456',
                hpoId: null,
                orphaId: null,
                prsModels: [
                  { prsModel: { id: 999 }, prsModelId: 999 } // No válido
                ]
              }
            },
            {
              trait: {
                id: 3,
                label: 'BMI',
                description: 'Body mass index',
                URL: 'http://example.com/bmi',
                efoId: null,
                mondoId: null,
                hpoId: 'HP_789',
                orphaId: null,
                prsModels: [
                  { prsModel: { id: 102 }, prsModelId: 102 },
                  { prsModel: { id: 103 }, prsModelId: 103 }
                ]
              }
            }
          ]
        };

        // Setup mocks
        mockPRSModelFindMany
          .mockResolvedValueOnce(mockDevelopedPrsModels as any) // First call for developed models
          .mockResolvedValueOnce(mockEvaluatedPrsModels as any); // Second call for evaluated models

        mockTraitCategoryFindUnique.mockResolvedValue(mockTraitCategory as any);

        // Act - call with broadAncestryIds
        const result = await getTraitsByCategoryId(1, [58, 59]);

        // Assert
        expect(result).toHaveLength(3); // All traits are returned, but with filtered PRS counts
        expect(result[0]).toEqual({
          id: 1,
          name: 'Height',
          pgss: 1, // Only one valid PRS model (101)
          description: 'Human height measurement',
          URL: 'http://example.com/height',
          onto_id: 'EFO_123'
        });
        expect(result[1]).toEqual({
          id: 2,
          name: 'Weight',
          pgss: 0, // No valid PRS models
          description: 'Body weight measurement',
          URL: 'http://example.com/weight',
          onto_id: 'MONDO_456'
        });
        expect(result[2]).toEqual({
          id: 3,
          name: 'BMI',
          pgss: 2, // Two valid PRS models (102, 103)
          description: 'Body mass index',
          URL: 'http://example.com/bmi',
          onto_id: 'HP_789'
        });

        // Verify the correct calls were made
        expect(mockPRSModelFindMany).toHaveBeenCalledTimes(2);
        expect(mockTraitCategoryFindUnique).toHaveBeenCalledTimes(1);
      });

      it('should return empty array when no traits have valid PRS models', async () => {
        // Arrange
        mockPRSModelFindMany
          .mockResolvedValueOnce([]) // No developed models
          .mockResolvedValueOnce([]); // No evaluated models

        const mockTraitCategory = {
          id: 1,
          traits: [
            {
              trait: {
                id: 1,
                label: 'Height',
                description: 'Human height measurement',
                URL: 'http://example.com/height',
                efoId: 'EFO_123',
                mondoId: null,
                hpoId: null,
                orphaId: null,
                prsModels: [
                  { prsModel: { id: 999 }, prsModelId: 999 } // Not in valid list
                ]
              }
            }
          ]
        };

        mockTraitCategoryFindUnique.mockResolvedValue(mockTraitCategory as any);

        // Act
        const result = await getTraitsByCategoryId(1, [58]);

        // Assert
        expect(result).toHaveLength(1); // Trait is returned but with pgss: 0
        expect(result[0]).toEqual({
          id: 1,
          name: 'Height',
          pgss: 0, // No valid PRS models
          description: 'Human height measurement',
          URL: 'http://example.com/height',
          onto_id: 'EFO_123'
        });
      });

      it('should handle traits with no PRS models when filtering', async () => {
        // Arrange
        const mockDevelopedPrsModels = [{ id: 101 }];
        const mockEvaluatedPrsModels = [{ id: 102 }];

        const mockTraitCategory = {
          id: 1,
          traits: [
            {
              trait: {
                id: 1,
                label: 'Height',
                description: 'Human height measurement',
                URL: 'http://example.com/height',
                efoId: 'EFO_123',
                mondoId: null,
                hpoId: null,
                orphaId: null,
                prsModels: [] // No PRS models
              }
            }
          ]
        };

        mockPRSModelFindMany
          .mockResolvedValueOnce(mockDevelopedPrsModels as any)
          .mockResolvedValueOnce(mockEvaluatedPrsModels as any);

        mockTraitCategoryFindUnique.mockResolvedValue(mockTraitCategory as any);

        // Act
        const result = await getTraitsByCategoryId(1, [58]);

        // Assert
        expect(result).toHaveLength(1); // Trait is returned but with pgss: 0
        expect(result[0]).toEqual({
          id: 1,
          name: 'Height',
          pgss: 0, // No PRS models at all
          description: 'Human height measurement',
          URL: 'http://example.com/height',
          onto_id: 'EFO_123'
        });
      });

      it('should return empty array when trait category not found with filtering', async () => {
        // Arrange
        const mockDevelopedPrsModels = [{ id: 101 }];
        const mockEvaluatedPrsModels = [{ id: 102 }];

        mockPRSModelFindMany
          .mockResolvedValueOnce(mockDevelopedPrsModels as any)
          .mockResolvedValueOnce(mockEvaluatedPrsModels as any);

        mockTraitCategoryFindUnique.mockResolvedValue(null);

        // Act
        const result = await getTraitsByCategoryId(999, [58]);

        // Assert
        expect(result).toEqual([]);
      });
    });

    it('should throw error when database fails', async () => {
      // Arrange
      const errorMessage = 'Database connection failed';
      mockTraitCategoryFindUnique.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(getTraitsByCategoryId(1)).rejects.toThrow('Could not fetch traits for category 1 from the database.');
    });
  });
});
