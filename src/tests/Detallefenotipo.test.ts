// Mock Prisma antes de cualquier importación
jest.mock('@/utils/prisma', () => ({
  __esModule: true,
  default: {
    trait: {
      findUnique: jest.fn(),
    },
  },
}));

import { getTraitDetails } from '../app/services/detallefenotipoonto';
import prisma from '@/utils/prisma';

// Tipar el mock correctamente
const mockFindUnique = prisma.trait.findUnique as jest.MockedFunction<typeof prisma.trait.findUnique>;

// Mock de console.error para suprimir logs de error esperados
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('detallefenotipoonto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTraitDetails', () => {
    it('debería retornar los detalles correctamente', async () => {
      // Arrange
      const mockDetail = {
        id: 1,
        name: 'Altura',
        categories: [
          {
            traitCategory: { id: 2, name: 'Físico' }
          }
        ]
      };
      mockFindUnique.mockResolvedValue(mockDetail as any);

      // Act
      const result = await getTraitDetails(1);

      // Assert
      expect(result).toEqual(mockDetail);
      expect(mockFindUnique).toHaveBeenCalledTimes(1);
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          categories: {
            include: {
              traitCategory: true
            }
          }
        },
      });
    });

    it('debería retornar null si no encuentra el trait', async () => {
      // Arrange
      mockFindUnique.mockResolvedValue(null);

      // Act
      const result = await getTraitDetails(999);

      // Assert
      expect(result).toBeNull();
    });

    it('debería manejar errores de base de datos', async () => {
      // Arrange
      mockFindUnique.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(getTraitDetails(1)).rejects.toThrow('Database error');
    });
  });
});
