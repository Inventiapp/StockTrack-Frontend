import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Product} from '../domain/model/product.entity';
import {ProductResource, ProductResponse} from './product-response';
import {ProductAssembler} from './product-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export class ProductsApiEndpoint extends BaseApiEndpoint<Product, ProductResource, ProductResponse, ProductAssembler> {
  constructor(http: HttpClient) {
    // Use backend API URL if available, otherwise fallback to platform provider API
    const baseUrl = (environment as any).platformBackendApiBaseUrl || environment.platformProviderApiBaseUrl;
    const endpointPath = baseUrl.includes('/api/v1') ? '/products' : environment.platformProviderProductsEndpointPath;
    super(http, `${baseUrl}${endpointPath}`, new ProductAssembler());
  }
}
