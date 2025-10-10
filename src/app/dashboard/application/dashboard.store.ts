import { Injectable, signal, computed } from '@angular/core';
import { DashboardStats } from '../domain/model/dashboard-stats.entity';
import { MonthlyIncome } from '../domain/model/monthly-income.entity';
import { ProductSales } from '../domain/model/product-sales.entity';
import { Notification } from '../domain/model/notification.entity';
import { DashboardApiService } from '../infrastructure/dashboard-api.service';

/**
 * Store for managing dashboard state and operations.
 * @remarks
 * This service orchestrates dashboard use cases and manages dashboard state.
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardStore {
  private readonly statsSignal = signal<DashboardStats | null>(null);
  private readonly monthlyIncomeSignal = signal<MonthlyIncome[]>([]);
  private readonly productSalesSignal = signal<ProductSales[]>([]);
  private readonly notificationsSignal = signal<Notification[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly stats = this.statsSignal.asReadonly();
  readonly monthlyIncome = this.monthlyIncomeSignal.asReadonly();
  readonly productSales = this.productSalesSignal.asReadonly();
  readonly notifications = this.notificationsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly hasData = computed(() => this.stats() !== null);

  constructor(private dashboardApi: DashboardApiService) {
    this.loadDashboardData();
  }

  /**
   * Loads all dashboard data.
   */
  loadDashboardData(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.dashboardApi.getDashboardStats().subscribe({
      next: (stats) => {
        this.statsSignal.set(stats);
      },
      error: (err) => {
        this.errorSignal.set('Error loading dashboard stats');
        this.loadingSignal.set(false);
      }
    });

    this.dashboardApi.getMonthlyIncome().subscribe({
      next: (data) => {
        this.monthlyIncomeSignal.set(data);
      },
      error: (err) => {
        this.errorSignal.set('Error loading monthly income');
      }
    });

    this.dashboardApi.getProductSales().subscribe({
      next: (data) => {
        this.productSalesSignal.set(data);
      },
      error: (err) => {
        this.errorSignal.set('Error loading product sales');
      }
    });

    // Load notifications
    this.dashboardApi.getNotifications().subscribe({
      next: (data) => {
        this.notificationsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set('Error loading notifications');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Refreshes dashboard data.
   */
  refresh(): void {
    this.loadDashboardData();
  }
}
