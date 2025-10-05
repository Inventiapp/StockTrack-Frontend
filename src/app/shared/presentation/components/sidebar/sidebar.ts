import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MenuItem {
  title: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent {
  isExpanded = true;

  // Menú dinámico basado en la imagen
  menuItems: MenuItem[] = [
    {
      title: 'Inicio',
      icon: 'home',
      route: '/',
    },
    {
      title: 'Inventario',
      icon: 'inventory_2',
      route: '/inventario',
    },
    {
      title: 'Proveedores',
      icon: 'people',
      route: '/proveedores',
    },
    {
      title: 'Venta',
      icon: 'shopping_cart',
      route: '/venta',
    },
    {
      title: 'Reportes',
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
}
