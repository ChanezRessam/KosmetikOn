export interface RawMaterial {
  id?: number;
  name: string;
  code: string;
  category: string;
  unit_of_measure: string;
  quantity: number;
  status: 'active' | 'inactive';
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface RawMaterialFilters {
  page?: number;
  pageSize?: number;
  name?: string;
  category?: string;
  status?: string;
}