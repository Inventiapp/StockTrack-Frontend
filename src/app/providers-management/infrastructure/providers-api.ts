import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {ProvidersApiEndpoint} from './providers-api-endpoint';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class ProvidersApi extends BaseApi {
  private readonly providersEndpoint: ProvidersApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.providersEndpoint = new ProvidersApiEndpoint(http);
  }

  getProviders(){
    return this.providersEndpoint.getAll();
  }

}
