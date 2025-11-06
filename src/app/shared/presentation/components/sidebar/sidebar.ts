import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { AuthStore } from '../../../../auth/application/auth.store';

interface MenuItem {
  titleKey: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LanguageSwitcher,
    TranslateModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
})
export class SidebarComponent {
  private translate = inject(TranslateService);
  protected authStore = inject(AuthStore);
  isExpanded = true;

  menuItems: MenuItem[] = [
    {
      titleKey: 'sidebar.menu.home',
      icon: 'home',
      route: '/dashboard',
    },
    {
      titleKey: 'sidebar.menu.inventory',
      icon: 'inventory_2',
      route: '/inventario',
    },
    {
      titleKey: 'sidebar.menu.providers',
      icon: 'people',
      route: '/proveedores',
    },
    {
      titleKey: 'sidebar.menu.sales',
      icon: 'shopping_cart',
      route: '/venta',
    },
    {
      titleKey: 'sidebar.menu.reports',
      icon: 'description',
      route: '/reportes',
    },
  ];

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  protected t(key: string): string {
    return this.translate.instant(key);
  }

  logout(): void {
    this.authStore.logout();
  }
}
