import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Provider} from '../../inventory/domain/model/provider.entity';
import {ProviderResource, ProviderResponse} from './provider-response';
import {ProviderAssembler} from './provider-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export class ProvidersApiEndpoint extends BaseApiEndpoint<Provider, ProviderResource, ProviderResponse, ProviderAssembler> {
  constructor(http: HttpClient) {
    // Use backend API URL if available, otherwise fallback to platform provider API
    const baseUrl = (environment as any).platformBackendApiBaseUrl || environment.platformProviderApiBaseUrl;
    const endpointPath = baseUrl.includes('/api/v1') ? '/providers' : environment.platformProviderProvidersEndpointPath;
    super(http, `${baseUrl}${endpointPath}`, new ProviderAssembler());
  }
}
