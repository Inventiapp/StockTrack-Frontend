import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Dashboard } from '../domain/model/dashboard.entity';
import { DashboardStats } from '../domain/model/dashboard-stats.entity';
import { MonthlyIncome } from '../domain/model/monthly-income.entity';
import { ProductSales } from '../domain/model/product-sales.entity';
import { DashboardNotification } from '../domain/model/notification.entity';
import { DashboardResource, DashboardResponse } from './dashboard-response';
import { DashboardAssembler } from './dashboard-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class DashboardApiEndpoint extends BaseApiEndpoint<Dashboard, DashboardResource, DashboardResponse, DashboardAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiBaseUrl}/dashboard`, new DashboardAssembler());
  }

  /**
   * Gets the complete dashboard data.
   * @returns An Observable of Dashboard.
   */
  getDashboard(): Observable<Dashboard> {
    return this.http.get<DashboardResponse>(this.endpointUrl).pipe(
      map(response => this.assembler.toDashboardFromResource(response))
    );
  }

  /**
   * Gets dashboard statistics.
   * @returns An Observable of DashboardStats.
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardResponse>(this.endpointUrl).pipe(
      map(response => this.assembler.toDashboardStatsFromResource(response))
    );
  }

  /**
   * Gets monthly income data for charts.
   * @returns An Observable of MonthlyIncome array.
   */
  getMonthlyIncome(): Observable<MonthlyIncome[]> {
    return this.http.get<DashboardResponse>(this.endpointUrl).pipe(
      map(response => this.assembler.toMonthlyIncomeFromResources(response.monthlyIncome))
    );
  }

  /**
   * Gets product sales data for charts.
   * @returns An Observable of ProductSales array.
   */
  getProductSales(): Observable<ProductSales[]> {
    return this.http.get<DashboardResponse>(this.endpointUrl).pipe(
      map(response => this.assembler.toProductSalesFromResources(response.productSales))
    );
  }

  /**
   * Gets notifications for the dashboard.
   * @returns An Observable of DashboardNotification array.
   */
  getNotifications(): Observable<DashboardNotification[]> {
    return this.http.get<DashboardResponse>(this.endpointUrl).pipe(
      map(response => this.assembler.toNotificationsFromResources(response.notifications))
    );
  }
}
