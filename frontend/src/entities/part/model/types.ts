export interface Part {
  id: string;
  repairId: string;
  name: string;
  sku?: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  supplier?: string;
  createdAt: string;
  updatedAt: string;
}

