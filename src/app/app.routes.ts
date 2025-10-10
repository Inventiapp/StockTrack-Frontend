import { Routes } from '@angular/router';
import { HomeComponent } from './shared/presentation/views/home/home';
import { InventoryListComponent } from './inventory/presentation/inventory-list/inventory-list';
import {ProvidersTable} from './providers-management/presentation/components/providers-table/providers-table';
import {ProviderComponent} from './shared/presentation/views/provider/provider';
import {SalesComponent} from './shared/presentation/views/sales/sales';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inventario', component: InventoryListComponent },
  { path: 'proveedores', component: ProviderComponent },
  { path: 'venta', component: SalesComponent },
  { path: 'reportes', component: HomeComponent },
  { path: 'configuracion', component: HomeComponent },
  { path: 'perfil', component: HomeComponent },
  { path: '**', redirectTo: '' }
];
