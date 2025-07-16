// Mock the service before imports
jest.mock('../app/services/traitByCategoryService', () => ({
  getTraitsByCategoryId: jest.fn(),
}));

import type { NextApiRequest, NextApiResponse } from 'next';
import { handleGetTraitsByCategory, TraitsByCategoryResponseData } from '../app/controllers/traitByCategoryController';
import { getTraitsByCategoryId, TraitSummary } from '../app/services/traitByCategoryService';

// Type the mock
const mockGetTraitsByCategoryId = getTraitsByCategoryId as jest.MockedFunction<typeof getTraitsByCategoryId>;

// Mock console.error
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('TraitByCategoryController', () => {
  let mockRequest: Partial<NextApiRequest>;
  let mockResponse: Partial<NextApiResponse<TraitsByCategoryResponseData>>;
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

  describe('handleGetTraitsByCategory', () => {
    it('should return traits without broadAncestryIds parameter', async () => {
      // Arrange
      const mockTraits: TraitSummary[] = [
        {
          id: 1,
          name: 'Height',
          pgss: 2,
          description: 'Human height measurement',
          URL: 'http://example.com/height',
          onto_id: 'EFO_123'
        },
        {
          id: 2,
          name: 'Weight',
          pgss: 1,
          description: 'Body weight measurement',
          URL: 'http://example.com/weight',
          onto_id: 'EFO_456'
        }
      ];

      mockGetTraitsByCategoryId.mockResolvedValue(mockTraits);

      // Set up request with categoryId only
      mockRequest.query = { categoryId: '1' };

      // Act
      await handleGetTraitsByCategory(mockRequest as NextApiRequest, mockResponse as NextApiResponse<TraitsByCategoryResponseData>);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ traits: mockTraits });
      expect(mockGetTraitsByCategoryId).toHaveBeenCalledWith(1, []); // Called with empty array when no ancestry IDs
    });

    it('should return traits with broadAncestryIds parameter as string', async () => {
      // Arrange
      const mockTraits: TraitSummary[] = [
        {
          id: 1,
          name: 'Height',
          pgss: 2,
          description: 'Human height measurement',
          URL: 'http://example.com/height',
          onto_id: 'EFO_123'
        }
      ];

      mockGetTraitsByCategoryId.mockResolvedValue(mockTraits);

      // Set up request with categoryId and broadAncestryIds as string
      mockRequest.query = { 
        categoryId: '1',
        broadAncestryIds: '58,59,60'
      };

      // Act
      await handleGetTraitsByCategory(mockRequest as NextApiRequest, mockResponse as NextApiResponse<TraitsByCategoryResponseData>);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ traits: mockTraits });
      expect(mockGetTraitsByCategoryId).toHaveBeenCalledWith(1, [58, 59, 60]);
    });

    it('should return traits with broadAncestryIds parameter as array', async () => {
      // Arrange
      const mockTraits: TraitSummary[] = [
        {
          id: 1,
          name: 'Height',
          pgss: 1,
          description: 'Human height measurement',
          URL: 'http://example.com/height',
          onto_id: 'EFO_123'
        }
      ];

      mockGetTraitsByCategoryId.mockResolvedValue(mockTraits);

      // Set up request with categoryId and broadAncestryIds as array
      mockRequest.query = { 
        categoryId: '2',
        broadAncestryIds: ['58', '59']
      };

      // Act
      await handleGetTraitsByCategory(mockRequest as NextApiRequest, mockResponse as NextApiResponse<TraitsByCategoryResponseData>);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ traits: mockTraits });
      expect(mockGetTraitsByCategoryId).toHaveBeenCalledWith(2, [58, 59]);
    });

    it('should handle single broadAncestryId parameter', async () => {
      // Arrange
      const mockTraits: TraitSummary[] = [
        {
          id: 1,
          name: 'Height',
          pgss: 1,
          description: 'Human height measurement',
          URL: 'http://example.com/height',
          onto_id: 'EFO_123'
        }
      ];

      mockGetTraitsByCategoryId.mockResolvedValue(mockTraits);

      // Set up request with single broadAncestryId
      mockRequest.query = { 
        categoryId: '3',
        broadAncestryIds: '58'
      };

      // Act
      await handleGetTraitsByCategory(mockRequest as NextApiRequest, mockResponse as NextApiResponse<TraitsByCategoryResponseData>);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ traits: mockTraits });
      expect(mockGetTraitsByCategoryId).toHaveBeenCalledWith(3, [58]);
    });

    it('should handle missing categoryId parameter', async () => {
      // Arrange
      mockRequest.query = {};

      // Act
      await handleGetTraitsByCategory(mockRequest as NextApiRequest, mockResponse as NextApiResponse<TraitsByCategoryResponseData>);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Missing or invalid trait category ID' });
      expect(mockGetTraitsByCategoryId).not.toHaveBeenCalled();
    });

    it('should handle invalid categoryId parameter (non-string)', async () => {
      // Arrange
      mockRequest.query = { categoryId: 123 as any };

      // Act
      await handleGetTraitsByCategory(mockRequest as NextApiRequest, mockResponse as NextApiResponse<TraitsByCategoryResponseData>);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Missing or invalid trait category ID' });
      expect(mockGetTraitsByCategoryId).not.toHaveBeenCalled();
    });

    it('should handle invalid categoryId parameter (non-numeric string)', async () => {
      // Arrange
      mockRequest.query = { categoryId: 'invalid' };

      // Act
      await handleGetTraitsByCategory(mockRequest as NextApiRequest, mockResponse as NextApiResponse<TraitsByCategoryResponseData>);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Invalid trait category ID' });
      expect(mockGetTraitsByCategoryId).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // Arrange
      const errorMessage = 'Database error';
      mockGetTraitsByCategoryId.mockRejectedValue(new Error(errorMessage));

      mockRequest.query = { categoryId: '1' };

      // Act
      await handleGetTraitsByCategory(mockRequest as NextApiRequest, mockResponse as NextApiResponse<TraitsByCategoryResponseData>);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Failed to fetch traits for category 1' });
      expect(console.error).toHaveBeenCalledWith('API Controller Error fetching traits for category 1:', expect.any(Error));
    });

    it('should handle empty result from service', async () => {
      // Arrange
      mockGetTraitsByCategoryId.mockResolvedValue([]);

      mockRequest.query = { categoryId: '999' };

      // Act
      await handleGetTraitsByCategory(mockRequest as NextApiRequest, mockResponse as NextApiResponse<TraitsByCategoryResponseData>);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ traits: [] });
      expect(mockGetTraitsByCategoryId).toHaveBeenCalledWith(999, []);
    });

    it('should filter out invalid broadAncestryIds', async () => {
      // Arrange
      const mockTraits: TraitSummary[] = [];
      mockGetTraitsByCategoryId.mockResolvedValue(mockTraits);

      // Set up request with mixed valid/invalid broadAncestryIds
      mockRequest.query = { 
        categoryId: '1',
        broadAncestryIds: '58,invalid,59,NaN,60'
      };

      // Act
      await handleGetTraitsByCategory(mockRequest as NextApiRequest, mockResponse as NextApiResponse<TraitsByCategoryResponseData>);

      // Assert
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ traits: mockTraits });
      expect(mockGetTraitsByCategoryId).toHaveBeenCalledWith(1, [58, 59, 60]); // Only valid IDs
    });
  });
});
