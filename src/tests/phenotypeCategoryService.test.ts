// Mock Prisma before importing the service
jest.mock('@/utils/prisma', () => ({
  __esModule: true,
  default: {
    traitCategory: {
      findMany: jest.fn(),
    },
  },
}));

import { getPhenotypeCategories } from '../app/services/phenotypeCategoryService';
import prisma from '@/utils/prisma';

const mockFindMany = prisma.traitCategory.findMany as jest.MockedFunction<typeof prisma.traitCategory.findMany>;

describe('PhenotypeCategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPhenotypeCategories', () => {
    it('should return phenotype categories with trait and PRS counts', async () => {
      // Arrange
      const mockCategories = [
        {
          id: 1,
          label: 'Category 1',
          traits: [
            {
              trait: {
                id: 1,
                efoId: 'EFO_001',
                _count: { prsModels: 10 },
              },
            },
            {
              trait: {
                id: 2,
                efoId: 'EFO_002',
                _count: { prsModels: 5 },
              },
            },
          ],
        },
        {
          id: 2,
          label: 'Category 2',
          traits: [
            {
              trait: {
                id: 3,
                efoId: 'EFO_003',
                _count: { prsModels: 20 },
              },
            },
          ],
        },
      ];
      mockFindMany.mockResolvedValue(mockCategories);

      // Act
      const result = await getPhenotypeCategories();

      // Assert
      expect(mockFindMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        {
          id: 1,
          label: 'Category 1',
          traits: ['EFO_001', 'EFO_002'],
          prs_count: 15,
        },
        {
          id: 2,
          label: 'Category 2',
          traits: ['EFO_003'],
          prs_count: 20,
        },
      ]);
    });

    it('should return an empty array if no categories are found', async () => {
        // Arrange
        mockFindMany.mockResolvedValue([]);
  
        // Act
        const result = await getPhenotypeCategories();
  
        // Assert
        expect(result).toEqual([]);
      });

    it('should throw an error if the database query fails', async () => {
      // Arrange
      mockFindMany.mockRejectedValue(new Error('DB Error'));

      // Act & Assert
      await expect(getPhenotypeCategories()).rejects.toThrow('Could not fetch phenotype categories with counts from the database.');
    });
  });
});
