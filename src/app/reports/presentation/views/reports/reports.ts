import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReportsStore } from '../../../application/reports.store';
import { ExcelExportService } from '../../../infrastructure/excel-export.service';
import { ProviderReport } from '../../../domain/model/provider-report.entity';
import { StockReport } from '../../../domain/model/stock-report.entity';
import { ExpiringProductReport } from '../../../domain/model/expiring-product-report.entity';
import { LowStockReport } from '../../../domain/model/low-stock-report.entity';

/**
 * Reports component displaying various reports.
 * @remarks
 * This component shows reports for providers, stock, expiring products, and low stock.
 */
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    TranslateModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class ReportsComponent implements OnInit {
  protected readonly store = inject(ReportsStore);
  private readonly translate = inject(TranslateService);
  private readonly excelExportService = inject(ExcelExportService);

  // Table columns
  protected providersColumns: string[] = ['name', 'ruc', 'email', 'phone', 'products'];
  protected stockColumns: string[] = ['productName', 'category', 'currentStock', 'minStock', 'unitPrice', 'totalValue', 'status'];
  protected expiringColumns: string[] = ['productName', 'category', 'expirationDate', 'daysLeft', 'currentStock', 'lot', 'status'];
  protected lowStockColumns: string[] = ['productName', 'category', 'currentStock', 'minStock', 'unitPrice', 'status'];

  // Month filter for expiring products
  protected selectedMonth: string | null = null;
  protected showAllProducts: boolean = false; // Special flag for "all products" option
  protected availableMonths: string[] = [];
  protected filteredExpiringProducts: ExpiringProductReport[] = [];

  // Category filter for providers report
  protected selectedCategoryFilter: string | null = null;
  protected availableCategories: string[] = [];
  protected filteredProvidersReport: ProviderReport[] = [];

  constructor() {
    // Watch for expiring products changes using effect
    effect(() => {
      const products = this.store.expiringProductsReport();
      const monthsSet = new Set<string>();

      if (products && products.length > 0) {
        products.forEach(product => {
          if (product.expirationDate) {
            try {
              const expirationDate = new Date(product.expirationDate);
              if (!isNaN(expirationDate.getTime())) {
                const month = expirationDate.toISOString().substring(0, 7); // YYYY-MM
                if (month && month.length === 7) {
                  monthsSet.add(month);
                }
              } else {
                // Fallback to substring method
                const month = product.expirationDate.substring(0, 7);
                if (month && month.length === 7) {
                  monthsSet.add(month);
                }
              }
            } catch {
              // Fallback to substring method
              const month = product.expirationDate.substring(0, 7);
              if (month && month.length === 7) {
                monthsSet.add(month);
              }
            }
          }
        });
        this.availableMonths = Array.from(monthsSet).sort();
      } else {
        this.availableMonths = [];
      }

      // Update filtered products when products change
      this.updateFilteredExpiringProducts();
    });

    // Watch for providers report changes to extract available categories
    effect(() => {
      const providers = this.store.providersReport();
      const categoriesSet = new Set<string>();

      providers.forEach(provider => {
        if (provider.categoryNames && provider.categoryNames.length > 0) {
          provider.categoryNames.forEach(categoryName => {
            categoriesSet.add(categoryName);
          });
        }
      });

      this.availableCategories = Array.from(categoriesSet).sort();
      this.updateFilteredProvidersReport();
    });
  }

  ngOnInit(): void {
    this.store.loadReportsData();
    // Initialize filtered products with all products initially
    this.updateFilteredExpiringProducts();
    this.updateFilteredProvidersReport();
  }

  /**
   * Updates filtered expiring products based on selected month.
   */
  protected onMonthFilterChange(): void {
    // Reset showAllProducts when month filter changes
    if (this.selectedMonth !== null) {
      this.showAllProducts = false;
    }
    this.updateFilteredExpiringProducts();
  }

  /**
   * Handles the "show all" option change.
   */
  protected onShowAllChange(): void {
    if (this.showAllProducts) {
      this.selectedMonth = null;
    }
    this.updateFilteredExpiringProducts();
  }

  /**
   * Updates the filtered expiring products list.
   * By default shows only products expiring in the next 30 days.
   */
  private updateFilteredExpiringProducts(): void {
    const allProducts = this.store.expiringProductsReport();
    if (!allProducts || allProducts.length === 0) {
      this.filteredExpiringProducts = [];
      return;
    }

    // If "show all" is selected, show all products
    if (this.showAllProducts) {
      this.filteredExpiringProducts = allProducts;
      return;
    }

    // If a specific month is selected, filter by that month
    if (this.selectedMonth) {
      this.filteredExpiringProducts = allProducts.filter(product => {
        if (!product.expirationDate) return false;
        try {
          const expirationDate = new Date(product.expirationDate);
          if (isNaN(expirationDate.getTime())) return false;
          const productMonth = expirationDate.toISOString().substring(0, 7);
          return productMonth === this.selectedMonth;
        } catch {
          // Try substring method as fallback
          const productMonth = product.expirationDate.substring(0, 7);
          return productMonth === this.selectedMonth;
        }
      });
      return;
    }

    // Default: show only products expiring in the next 30 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    thirtyDaysFromNow.setHours(23, 59, 59, 999);

    this.filteredExpiringProducts = allProducts.filter(product => {
      if (!product.expirationDate) return false;
      const expirationDate = new Date(product.expirationDate);
      expirationDate.setHours(0, 0, 0, 0);
      return expirationDate >= today && expirationDate <= thirtyDaysFromNow;
    });
  }

  /**
   * Gets the display name for a month filter option.
   */
  protected getMonthDisplayName(month: string): string {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    return date.toLocaleString('es-PE', { month: 'long', year: 'numeric' });
  }

  /**
   * Clears the month filter and resets to default (next 30 days).
   */
  protected clearMonthFilter(): void {
    this.selectedMonth = null;
    this.showAllProducts = false;
    this.updateFilteredExpiringProducts();
  }

  /**
   * Updates filtered providers report based on selected category filter.
   */
  protected onCategoryFilterChange(): void {
    this.updateFilteredProvidersReport();
  }

  /**
   * Updates the filtered providers report list.
   */
  private updateFilteredProvidersReport(): void {
    const allProviders = this.store.providersReport();

    if (!this.selectedCategoryFilter || this.selectedCategoryFilter === '') {
      this.filteredProvidersReport = allProviders;
      return;
    }

    // Filter providers that have products in the selected category
    this.filteredProvidersReport = allProviders.filter(provider => {
      return provider.categoryNames && provider.categoryNames.includes(this.selectedCategoryFilter!);
    });
  }

  /**
   * Clears the category filter.
   */
  protected clearCategoryFilter(): void {
    this.selectedCategoryFilter = null;
    this.updateFilteredProvidersReport();
  }

  protected t(key: string): string {
    return this.translate.instant(key);
  }

  /**
   * Gets the stock status chip color.
   */
  protected getStockStatusColor(status: 'normal' | 'low' | 'critical'): string {
    switch (status) {
      case 'critical':
        return 'warn';
      case 'low':
        return 'accent';
      default:
        return 'primary';
    }
  }

  /**
   * Gets the expiration status chip color.
   */
  protected getExpirationStatusColor(status: 'expired' | 'critical' | 'warning' | 'normal'): string {
    switch (status) {
      case 'expired':
        return 'warn';
      case 'critical':
        return 'warn';
      case 'warning':
        return 'accent';
      default:
        return 'primary';
    }
  }

  /**
   * Formats days until expiration, showing months if more than 30 days.
   */
  protected formatDaysUntilExpiration(report: ExpiringProductReport): string {
    const days = report.getDaysUntilExpiration();
    if (days < 0) {
      return this.t('reports.expired');
    }
    if (days === 0) {
      return this.t('reports.expiresToday');
    }
    if (days === 1) {
      return this.t('reports.expiresTomorrow');
    }

    // If more than 30 days, show in months
    if (days > 30) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      if (remainingDays === 0) {
        return months === 1
          ? this.t('reports.monthLeft').replace('{months}', months.toString())
          : this.t('reports.monthsLeft').replace('{months}', months.toString());
      } else {
        const monthText = months === 1
          ? this.t('reports.monthLeft').replace('{months}', months.toString())
          : this.t('reports.monthsLeft').replace('{months}', months.toString());
        const daysText = remainingDays === 1
          ? this.t('reports.dayLeft').replace('{days}', remainingDays.toString())
          : this.t('reports.daysLeft').replace('{days}', remainingDays.toString());
        return `${monthText} ${daysText}`;
      }
    }

    // Less than 30 days, show days
    return this.t('reports.daysLeft').replace('{days}', days.toString());
  }

  /**
   * Refreshes the reports.
   */
  protected refreshReports(): void {
    this.store.refresh();
  }

  /**
   * Exports providers report to Excel.
   */
  protected exportProvidersReport(): void {
    const data = this.store.providersReport();
    if (data.length > 0) {
      this.excelExportService.exportProvidersReport(data);
    }
  }

  /**
   * Exports stock report to Excel.
   */
  protected exportStockReport(): void {
    const data = this.store.stockReport();
    if (data.length > 0) {
      this.excelExportService.exportStockReport(data);
    }
  }

  /**
   * Exports expiring products report to Excel.
   */
  protected exportExpiringProductsReport(): void {
    // Export the filtered products, not all products
    const dataToExport = this.showAllProducts
      ? this.store.expiringProductsReport()
      : this.filteredExpiringProducts;

    if (dataToExport.length > 0) {
      // If filtering by month, pass the month; otherwise pass undefined
      const monthFilter = this.selectedMonth || (this.showAllProducts ? undefined : undefined);
      this.excelExportService.exportExpiringProductsReport(dataToExport, 'reporte-productos-por-vencer', monthFilter);
    }
  }

  /**
   * Exports low stock report to Excel.
   */
  protected exportLowStockReport(): void {
    const data = this.store.lowStockReport();
    if (data.length > 0) {
      this.excelExportService.exportLowStockReport(data);
    }
  }
}

