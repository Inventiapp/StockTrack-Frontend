import {Injectable} from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {RestockingApiEndpoint} from './restocking-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Restocking} from '../domain/model/restocking.entity';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class RestockingApi extends BaseApi {
  private readonly restockingEndpoint: RestockingApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.restockingEndpoint = new RestockingApiEndpoint(http);
  }

  getRestockings(): Observable<Restocking[]> {
    return this.restockingEndpoint.getAll();
  }

  getRestockingById(id: number): Observable<Restocking> {
    return this.restockingEndpoint.getById(id);
  }

  createRestocking(restocking: Restocking): Observable<Restocking> {
    return this.restockingEndpoint.create(restocking);
  }
}
