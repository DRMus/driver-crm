export interface Client {
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  vehicles?: Vehicle[];
}

export interface Vehicle {
  id: string;
  clientId: string;
  make: string;
  model: string;
  year?: number;
  plateNumber?: string;
  vin?: string;
  engine?: string;
  transmission?: string;
  color?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientsListResponse {
  data: Client[];
  total: number;
}

