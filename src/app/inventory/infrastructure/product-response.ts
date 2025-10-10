import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface ProductResource extends BaseResource {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  providerId: string;
  minStock: number;
  unitPrice: number;
  isActive: boolean;
}

export interface ProductResponse extends BaseResponse {
  products: ProductResource[];
}
