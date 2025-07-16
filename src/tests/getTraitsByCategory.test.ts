// Mock Prisma before any imports
jest.mock('@/utils/prisma', () => ({
  __esModule: true,
  default: {
    trait: {
      findMany: jest.fn(),
    },
  },
}));

import { getTraitsByCategory } from '../app/services/TraitService';
import prisma from '@/utils/prisma';

// Type the mock properly
const mockFindMany = prisma.trait.findMany as jest.MockedFunction<typeof prisma.trait.findMany>;

// Mock console.error to suppress expected error logs
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('TraitService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTraitsByCategory', () => {
    it('should return data successfully', async () => {
      // Arrange - setup proper mock data
      const mockTraits = [
        { label: 'Height' },
        { label: 'Weight' }
      ];
      
      mockFindMany.mockResolvedValue(mockTraits as any);

      // Act
      const result = await getTraitsByCategory(1);

      // Assert
      expect(result).toEqual(['Height', 'Weight']);
      expect(mockFindMany).toHaveBeenCalledTimes(1);
    });

    it('should handle empty results', async () => {
      // Arrange
      mockFindMany.mockResolvedValue([]);

      // Act
      const result = await getTraitsByCategory(1);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      // Arrange
      mockFindMany.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(getTraitsByCategory(1)).rejects.toThrow('Error obteniendo traits por categoría.');
    });
  });
});