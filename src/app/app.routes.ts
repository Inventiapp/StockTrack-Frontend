import { Routes } from '@angular/router';
import { HomeComponent } from './shared/presentation/views/home/home';
import { InventoryListComponent } from './inventory/presentation/inventory-list/inventory-list';
import {ProvidersTable} from './providers-management/presentation/components/providers-table/providers-table';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inventario', component: InventoryListComponent },
  { path: 'proveedores', component: ProvidersTable },
  { path: 'venta', component: HomeComponent },
  { path: 'reportes', component: HomeComponent },
  { path: 'configuracion', component: HomeComponent },
  { path: 'perfil', component: HomeComponent },
  { path: '**', redirectTo: '' }
];
