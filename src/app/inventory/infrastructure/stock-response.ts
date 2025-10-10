import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface StockResource extends BaseResource {
  id: string;
  productId: string;
  currentStock: number;
  lastUpdated: string;
}

export interface StockResponse extends BaseResponse {
  stock: StockResource[];
}
