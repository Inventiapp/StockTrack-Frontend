import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { DashboardStats } from '../domain/model/dashboard-stats.entity';
import { MonthlyIncome } from '../domain/model/monthly-income.entity';
import { ProductSales } from '../domain/model/product-sales.entity';
import { Notification } from '../domain/model/notification.entity';
import { DashboardResponse } from './dashboard-response';

/**
 * Service for handling dashboard API calls.
 * @remarks
 * This service manages communication with the dashboard backend.
 * Currently uses mock data for development purposes.
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardApiService {

  constructor() {}

  /**
   * Gets dashboard statistics.
   * @returns An Observable of DashboardStats.
   */
  getDashboardStats(): Observable<DashboardStats> {
    const mockResponse: DashboardResponse = {
      stats: {
        productsInInventory: 121,
        monthlyIncome: 2500.50,
        salesThisMonth: 36,
        productsWithAlerts: 4
      },
      monthlyIncome: [
        { month: 'Jan', amount: 350 },
        { month: 'Feb', amount: 420 },
        { month: 'Mar', amount: 300 },
        { month: 'Apr', amount: 480 },
        { month: 'May', amount: 520 },
        { month: 'Jun', amount: 150 },
        { month: 'Jul', amount: 380 },
        { month: 'Aug', amount: 580 },
        { month: 'Sep', amount: 450 },
        { month: 'Oct', amount: 520 },
        { month: 'Nov', amount: 380 },
        { month: 'Dec', amount: 0 }
      ],
      productSales: [
        { productName: 'Galletas Animalitos', percentage: 75.2 },
        { productName: 'Chocolate Sublime', percentage: 21.6 },
        { productName: 'Inca Kola 1L', percentage: 3.2 }
      ]
    };

    return of(mockResponse).pipe(
      delay(500),
      map(response => new DashboardStats({
        productsInInventory: response.stats.productsInInventory,
        monthlyIncome: response.stats.monthlyIncome,
        salesThisMonth: response.stats.salesThisMonth,
        productsWithAlerts: response.stats.productsWithAlerts
      }))
    );
  }

  /**
   * Gets monthly income data for charts.
   * @returns An Observable of MonthlyIncome array.
   */
  getMonthlyIncome(): Observable<MonthlyIncome[]> {
    const mockData = [
      { month: 'Jan', amount: 350 },
      { month: 'Feb', amount: 420 },
      { month: 'Mar', amount: 300 },
      { month: 'Apr', amount: 480 },
      { month: 'May', amount: 520 },
      { month: 'Jun', amount: 150 },
      { month: 'Jul', amount: 380 },
      { month: 'Aug', amount: 580 },
      { month: 'Sep', amount: 450 },
      { month: 'Oct', amount: 520 },
      { month: 'Nov', amount: 380 },
      { month: 'Dec', amount: 0 }
    ];

    return of(mockData).pipe(
      delay(500),
      map(data => data.map(item => new MonthlyIncome(item)))
    );
  }

  /**
   * Gets product sales data for charts.
   * @returns An Observable of ProductSales array.
   */
  getProductSales(): Observable<ProductSales[]> {
    const mockData = [
      { productName: 'Galletas Animalitos', percentage: 75.2 },
      { productName: 'Chocolate Sublime', percentage: 21.6 },
      { productName: 'Inca Kola 1L', percentage: 3.2 }
    ];

    return of(mockData).pipe(
      delay(500),
      map(data => data.map(item => new ProductSales(item)))
    );
  }

  /**
   * Gets notifications for the dashboard.
   * @returns An Observable of Notification array.
   */
  getNotifications(): Observable<Notification[]> {
    const mockData = [
      {
        id: '1',
        type: 'warning' as const,
        title: 'expiringProduct',
        message: '',
        data: { product: 'Leche evaporada', date: '29/04/25' }
      },
      {
        id: '2',
        type: 'alert' as const,
        title: 'lowStock',
        message: '',
        data: { product: 'Papel toalla', quantity: 5 }
      }
    ];

    return of(mockData).pipe(
      delay(500),
      map(data => data.map(item => new Notification(item)))
    );
  }
}

