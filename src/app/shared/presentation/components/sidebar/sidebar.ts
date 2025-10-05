import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcher } from '../language-switcher/language-switcher';

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
  imports: [CommonModule, RouterModule, LanguageSwitcher, TranslateModule],
})
export class SidebarComponent {
  private translate = inject(TranslateService);
  isExpanded = true;

  // Menú dinámico con keys de traducción
  menuItems: MenuItem[] = [
    {
      titleKey: 'sidebar.menu.home',
      icon: 'home',
      route: '/',
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

  expandSidebar() {
    this.isExpanded = true;
  }

  collapseSidebar() {
    this.isExpanded = false;
  }

  protected t(key: string): string {
    return this.translate.instant(key);
  }
}
