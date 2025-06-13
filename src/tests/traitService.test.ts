// Mock Prisma SIEMPRE PRIMERO
jest.mock('@/utils/prisma', () => ({
  __esModule: true,
  default: {
    // CAMBIAR: nombre de tu tabla
    tuTabla: {
      findMany: jest.fn(),
      // agregar otros métodos que uses: findUnique, create, etc.
    },
  },
}));

// Imports después del mock
import { tuFuncionDelServicio } from '../app/services/tuServicio';
import prisma from '@/utils/prisma';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('TuServicio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('tuFuncionDelServicio', () => {
    it('should return data successfully', async () => {
      // 1. ARRANGE - prepara datos falsos
      const mockData = [{ id: 1, name: 'test' }];
      mockPrisma.tuTabla.findMany.mockResolvedValue(mockData);

      // 2. ACT - ejecuta tu función
      const result = await tuFuncionDelServicio();

      // 3. ASSERT - verifica que funcione
      expect(result).toEqual(mockData);
    });

    it('should handle errors', async () => {
      // Error case
      mockPrisma.tuTabla.findMany.mockRejectedValue(new Error('DB error'));
      
      await expect(tuFuncionDelServicio()).rejects.toThrow();
    });
  });
});