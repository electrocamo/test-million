import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Property {
  id?: string;
  idOwner: string;
  name: string;
  address: string;
  price: number;
  image: string;
}

export interface PropertyFilter {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreatePropertyDto {
  idOwner: string;
  name: string;
  address: string;
  price: number;
  image: string;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const propertyApi = {
  // Get all properties
  getAll: async (): Promise<Property[]> => {
    const response = await api.get<Property[]>('/properties');
    return response.data;
  },

  // Get property by ID
  getById: async (id: string): Promise<Property> => {
    const response = await api.get<Property>(`/properties/${id}`);
    return response.data;
  },

  // Search properties with filters
  search: async (filters: PropertyFilter): Promise<Property[]> => {
    const params = new URLSearchParams();
    
    if (filters.name) params.append('name', filters.name);
    if (filters.address) params.append('address', filters.address);
    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());

    const response = await api.get<Property[]>(`/properties/search?${params.toString()}`);
    return response.data;
  },

  // Create a new property
  create: async (property: CreatePropertyDto): Promise<Property> => {
    const response = await api.post<Property>('/properties', property);
    return response.data;
  },

  // Update a property
  update: async (id: string, property: Partial<Property>): Promise<void> => {
    await api.put(`/properties/${id}`, property);
  },

  // Delete a  property
  delete: async (id: string): Promise<void> => {
    await api.delete(`/properties/${id}`);
  },
};

export default api;



