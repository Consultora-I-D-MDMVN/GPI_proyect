// Mock Prisma antes de importar el servicio
jest.mock('@/utils/prisma', () => ({
  __esModule: true,
  default: {
    pRSModelToTrait: {
      findMany: jest.fn(),
    },
  },
}));

import { getPrsModelsByTraits } from '../app/services/PRSModelservice';
import prisma from '@/utils/prisma';

const mockFindMany = prisma.pRSModelToTrait.findMany as jest.MockedFunction<typeof prisma.pRSModelToTrait.findMany>;

describe('PRSModelservice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPrsModelsByTraits', () => {
    it('debería retornar modelos PRS relacionados a los traits', async () => {
      // Arrange
      const traitIds = [1, 2];
      const mockRelations = [
        {
          prsModel: { id: 10, name: 'PRS1' },
          trait: { id: 1, name: 'Trait1' }
        },
        {
          prsModel: { id: 11, name: 'PRS2' },
          trait: { id: 2, name: 'Trait2' }
        }
      ];
      mockFindMany.mockResolvedValue(mockRelations as any);

      // Act
      const result = await getPrsModelsByTraits(traitIds);

      // Assert
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { traitId: { in: traitIds } },
        include: { prsModel: true, trait: true }
      });
      expect(result).toEqual([
        { id: 10, name: 'PRS1' },
        { id: 11, name: 'PRS2' }
      ]);
    });

    it('debería lanzar error si no se pasan traits', async () => {
      await expect(getPrsModelsByTraits([])).rejects.toThrow('Se requiere al menos un trait para la búsqueda');
    });

    it('debería lanzar error si falla la base de datos', async () => {
      mockFindMany.mockRejectedValue(new Error('DB error'));
      await expect(getPrsModelsByTraits([1])).rejects.toThrow('Failed to retrieve PRS models associated with selected traits.');
    });

    it('debería retornar modelos PRS si se pasan traits válidos', async () => {
      const traitIds = [1, 2]; // traits existentes
      const mockRelations = [
        { prsModel: { id: 101, name: 'PRS-A' }, trait: { id: 1, name: 'Trait1' } },
        { prsModel: { id: 102, name: 'PRS-B' }, trait: { id: 2, name: 'Trait2' } }
      ];
      mockFindMany.mockResolvedValue(mockRelations as any);

      const result = await getPrsModelsByTraits(traitIds);

      expect(result).toEqual([
        { id: 101, name: 'PRS-A' },
        { id: 102, name: 'PRS-B' }
      ]);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { traitId: { in: traitIds } },
        include: { prsModel: true, trait: true }
      });
    });
  });
});
