import { BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * DTO for dashboard statistics from the API.
 */
export interface DashboardStatsResource {
  productsInInventory: number;
  monthlyIncome: number;
  salesThisMonth: number;
  productsWithAlerts: number;
}

/**
 * DTO for monthly income data from the API.
 */
export interface MonthlyIncomeResource {
  month: string;
  amount: number;
}

/**
 * DTO for product sales data from the API.
 */
export interface ProductSalesResource {
  productName: string;
  percentage: number;
}

/**
 * DTO for dashboard response from the API.
 */
export interface DashboardResponse extends BaseResponse {
  stats: DashboardStatsResource;
  monthlyIncome: MonthlyIncomeResource[];
  productSales: ProductSalesResource[];
}

