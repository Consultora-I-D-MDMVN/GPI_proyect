import { getTraitIdsWithEfoId } from '@/app/services/SelectEFOtraitsServices';
import prisma from '@/utils/prisma';

// Mock the Prisma client
jest.mock('@/utils/prisma', () => ({
    trait: {
        findMany: jest.fn(),
    },
}));

describe('SelectEFOtraitsServices', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return trait IDs when valid EFO IDs are provided', async () => {
        // Mock data
        const mockTraits = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
        ];

        // Setup mock implementation
        (prisma.trait.findMany as jest.Mock).mockResolvedValue(mockTraits);

        // Test data
        const efoIds = ['EFO:0000001', 'EFO:0000002'];

        // Execute test
        const result = await getTraitIdsWithEfoId(efoIds);

        // Assert results
        expect(prisma.trait.findMany).toHaveBeenCalledWith({
            where: {
                efoId: {
                    in: efoIds,
                },
            },
            select: {
                id: true,
            },
        });
        expect(result).toEqual([1, 2, 3]);
    });

    it('should return empty array when no traits are found', async () => {
        // Setup mock implementation
        (prisma.trait.findMany as jest.Mock).mockResolvedValue([]);

        // Test data
        const efoIds = ['EFO:9999999'];

        // Execute test
        const result = await getTraitIdsWithEfoId(efoIds);

        // Assert results
        expect(result).toEqual([]);
    });

    it('should throw an error when prisma query fails', async () => {
        // Setup mock implementation
        (prisma.trait.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

        // Test data
        const efoIds = ['EFO:0000001'];

        // Execute test and expect error
        await expect(getTraitIdsWithEfoId(efoIds)).rejects.toThrow('Error obteniendo trait IDs con efoId.');
    });
});