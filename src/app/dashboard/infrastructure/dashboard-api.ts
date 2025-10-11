import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardApiEndpoint } from './dashboard-api-endpoint';
import { Dashboard } from '../domain/model/dashboard.entity';
import { DashboardStats } from '../domain/model/dashboard-stats.entity';
import { MonthlyIncome } from '../domain/model/monthly-income.entity';
import { ProductSales } from '../domain/model/product-sales.entity';
import { DashboardNotification } from '../domain/model/notification.entity';

/**
 * Service for handling dashboard API calls.
 * @remarks
 * This service manages communication with the dashboard backend.
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardApi {
  private readonly endpoint: DashboardApiEndpoint;

  constructor(private http: HttpClient) {
    this.endpoint = new DashboardApiEndpoint(this.http);
  }

  /**
   * Gets the complete dashboard data.
   * @returns An Observable of Dashboard.
   */
  getDashboard(): Observable<Dashboard> {
    return this.endpoint.getDashboard();
  }

  /**
   * Gets dashboard statistics.
   * @returns An Observable of DashboardStats.
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.endpoint.getDashboardStats();
  }

  /**
   * Gets monthly income data for charts.
   * @returns An Observable of MonthlyIncome array.
   */
  getMonthlyIncome(): Observable<MonthlyIncome[]> {
    return this.endpoint.getMonthlyIncome();
  }

  /**
   * Gets product sales data for charts.
   * @returns An Observable of ProductSales array.
   */
  getProductSales(): Observable<ProductSales[]> {
    return this.endpoint.getProductSales();
  }

  /**
   * Gets notifications for the dashboard.
   * @returns An Observable of DashboardNotification array.
   */
  getNotifications(): Observable<DashboardNotification[]> {
    return this.endpoint.getNotifications();
  }
}
