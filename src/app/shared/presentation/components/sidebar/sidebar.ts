import { Component, inject, computed } from '@angular/core';
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
  requiredRoles?: string[]; // If undefined, visible to all authenticated users
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

  private allMenuItems: MenuItem[] = [
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
      requiredRoles: ['ROLE_ADMIN'], // Only visible to admins
    },
  ];

  /**
   * Computed property that filters menu items based on user roles.
   * ROLE_ADMIN sees all items, ROLE_SELLER doesn't see Reports.
   */
  menuItems = computed(() => {
    return this.allMenuItems.filter(item => {
      // If no roles required, show to everyone
      if (!item.requiredRoles || item.requiredRoles.length === 0) {
        return true;
      }
      // Check if user has any of the required roles
      return this.authStore.hasAnyRole(item.requiredRoles);
    });
  });

  /**
   * Check if user can access personal administration (admin only).
   */
  canAccessPersonalAdmin = computed(() => {
    return this.authStore.hasRole('ROLE_ADMIN');
  });

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
