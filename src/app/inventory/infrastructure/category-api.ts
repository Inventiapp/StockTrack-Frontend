import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface CategoryResource { id: string; name: string; }

@Injectable({ providedIn: 'root' })
export class CategoryApi {
  private readonly baseUrl = `${environment.platformProviderApiBaseUrl}/categories`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<CategoryResource[]> { return this.http.get<CategoryResource[]>(this.baseUrl); }
}
