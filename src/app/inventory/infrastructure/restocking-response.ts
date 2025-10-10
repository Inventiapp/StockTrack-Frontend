import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

export interface RestockingItemResource {
  productId: string;
  quantityToAdd: number;
}

export interface RestockingResource extends BaseResource {
  id: string;
  lot: string;
  receptionDate: string;
  expirationDate: string;
  items: RestockingItemResource[];
}

export interface RestockingResponse extends BaseResponse {
  restockings: RestockingResource[];
}
