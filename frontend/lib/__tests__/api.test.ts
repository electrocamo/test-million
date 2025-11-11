import MockAdapter from 'axios-mock-adapter';
import { propertyApi } from '../api';
import api from '../api';

describe('propertyApi', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('getAll', () => {
    it('should fetch all properties', async () => {
      const mockProperties = [
        {
          id: '1',
          idOwner: 'owner1',
          name: 'Property 1',
          address: 'Address 1',
          price: 100000,
          image: 'https://example.com/image1.jpg',
        },
        {
          id: '2',
          idOwner: 'owner2',
          name: 'Property 2',
          address: 'Address 2',
          price: 200000,
          image: 'https://example.com/image2.jpg',
        },
      ];

      mock.onGet('/properties').reply(200, mockProperties);

      const result = await propertyApi.getAll();

      expect(result).toEqual(mockProperties);
      expect(result).toHaveLength(2);
    });

    it('should handle errors when fetching properties', async () => {
      mock.onGet('/properties').reply(500);

      await expect(propertyApi.getAll()).rejects.toThrow();
    });
  });

  describe('getById', () => {
    it('should fetch a property by id', async () => {
      const mockProperty = {
        id: '1',
        idOwner: 'owner1',
        name: 'Property 1',
        address: 'Address 1',
        price: 100000,
        image: 'https://example.com/image1.jpg',
      };

      mock.onGet('/properties/1').reply(200, mockProperty);

      const result = await propertyApi.getById('1');

      expect(result).toEqual(mockProperty);
      expect(result.id).toBe('1');
    });

    it('should handle 404 when property not found', async () => {
      mock.onGet('/properties/999').reply(404);

      await expect(propertyApi.getById('999')).rejects.toThrow();
    });
  });

  describe('search', () => {
    it('should search properties with filters', async () => {
      const mockProperties = [
        {
          id: '1',
          idOwner: 'owner1',
          name: 'Test Property',
          address: 'Test Address',
          price: 150000,
          image: 'https://example.com/image1.jpg',
        },
      ];

      const filters = {
        name: 'Test',
        minPrice: 100000,
        maxPrice: 200000,
      };

      // Match the search endpoint with query params
      mock.onGet(/\/properties\/search/).reply(200, mockProperties);

      const result = await propertyApi.search(filters);

      expect(result).toEqual(mockProperties);
    });

    it('should handle empty filters', async () => {
      const mockProperties = [];
      
      // Match the search endpoint with query params
      mock.onGet(/\/properties\/search/).reply(200, mockProperties);

      const result = await propertyApi.search({});

      expect(result).toEqual(mockProperties);
    });
  });

  describe('create', () => {
    it('should create a new property', async () => {
      const newProperty = {
        idOwner: 'owner1',
        name: 'New Property',
        address: 'New Address',
        price: 300000,
        image: 'https://example.com/image.jpg',
      };

      const createdProperty = {
        id: '123',
        ...newProperty,
      };

      mock.onPost('/properties').reply(201, createdProperty);

      const result = await propertyApi.create(newProperty);

      expect(result).toEqual(createdProperty);
      expect(result.id).toBe('123');
    });

    it('should handle validation errors', async () => {
      const invalidProperty = {
        idOwner: '',
        name: '',
        address: '',
        price: -1,
        image: '',
      };

      mock.onPost('/properties').reply(400);

      await expect(propertyApi.create(invalidProperty)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a property', async () => {
      const updates = {
        name: 'Updated Property',
        price: 350000,
      };

      mock.onPut('/properties/1').reply(204);

      await propertyApi.update('1', updates);

      expect(mock.history.put.length).toBe(1);
      expect(mock.history.put[0].url).toBe('/properties/1');
    });

    it('should handle not found errors', async () => {
      mock.onPut('/properties/999').reply(404);

      await expect(propertyApi.update('999', { name: 'Test' })).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a property', async () => {
      mock.onDelete('/properties/1').reply(204);

      await propertyApi.delete('1');

      expect(mock.history.delete.length).toBe(1);
      expect(mock.history.delete[0].url).toBe('/properties/1');
    });

    it('should handle not found errors', async () => {
      mock.onDelete('/properties/999').reply(404);

      await expect(propertyApi.delete('999')).rejects.toThrow();
    });
  });
});

