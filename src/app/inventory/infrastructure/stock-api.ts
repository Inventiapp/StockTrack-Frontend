import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {environment} from '../../../environments/environment';
import {StockResource} from './stock-response';

@Injectable({providedIn: 'root'})
export class StockApi {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderStockEndpointPath}`;
  }

  getStock(): Observable<StockResource[]> {
    return this.http.get<StockResource[]>(this.baseUrl);
  }

  getStockByProductId(productId: string): Observable<StockResource | undefined> {
    return this.http.get<StockResource[]>(`${this.baseUrl}?productId=${productId}`).pipe(
      map(stocks => stocks.length > 0 ? stocks[0] : undefined)
    );
  }

  updateStock(id: string, currentStock: number): Observable<StockResource> {
    return this.http.patch<StockResource>(`${this.baseUrl}/${id}`, {
      currentStock,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  }

  createStock(productId: string, currentStock = 0) {
    const body = {
      id: `stock-${Date.now()}`,
      productId,
      currentStock,
      lastUpdated: new Date().toISOString().slice(0,10)
    };
    return this.http.post(`${this.baseUrl}`, body);
  }

}
