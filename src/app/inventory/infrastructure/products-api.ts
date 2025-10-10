import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {ProductsApiEndpoint} from './products-api-endpoint';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class ProductsApi extends BaseApi {
  private readonly productsEndpoint: ProductsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.productsEndpoint = new ProductsApiEndpoint(http);
  }

  getProducts(){
    return this.productsEndpoint.getAll();
  }

  getProductById(id: number) {
    return this.productsEndpoint.getById(id);
  }

  createProduct(product: any) {
    return this.productsEndpoint.create(product);
  }


}
