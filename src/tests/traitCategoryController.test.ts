// Mock Prisma before any imports
jest.mock('@/utils/prisma', () => ({
  __esModule: true,
  default: {
    traitCategory: {
      findMany: jest.fn(),
    },
  },
}));

import type { NextApiRequest, NextApiResponse } from 'next';
import { handleGetTraitCategories } from '../app/controllers/traitCategoryController';
import * as traitCategoryService from '../app/services/traitCategoryService';

// Mock the traitCategoryService
jest.mock('../app/services/traitCategoryService');

// Mock console.error
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('TraitCategoryController', () => {
  let mockRequest: Partial<NextApiRequest>;
  let mockResponse: Partial<NextApiResponse>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    
    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnThis();
    
    mockRequest = {};
    mockResponse = {
      json: responseJson,
      status: responseStatus
    };
  });

  describe('handleGetTraitCategories', () => {
    it('debería obtener todas las categorías de rasgos con éxito', async () => {
      const mockCategories = [
        { id: 1, name: 'Physical', traitCount: 5 },
        { id: 2, name: 'Personality', traitCount: 8 }
      ];
      
      // Mock the service response
      (traitCategoryService.getTraitCategoriesWithCounts as jest.Mock).mockResolvedValue(mockCategories);
      
      await handleGetTraitCategories(mockRequest as NextApiRequest, mockResponse as NextApiResponse);
      
      expect(traitCategoryService.getTraitCategoriesWithCounts).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ categories: mockCategories });
    });

    it('debería manejar errores del servicio correctamente', async () => {
      const error = new Error('Database connection failed');
      (traitCategoryService.getTraitCategoriesWithCounts as jest.Mock).mockRejectedValue(error);
      
      await handleGetTraitCategories(mockRequest as NextApiRequest, mockResponse as NextApiResponse);
      
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Failed to fetch trait categories' });
      expect(console.error).toHaveBeenCalledWith('API Controller Error fetching trait categories:', error);
    });
  });
});