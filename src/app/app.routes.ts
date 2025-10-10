import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { HomeComponent } from './shared/presentation/views/home/home';
import { InventoryListComponent } from './inventory/presentation/inventory-list/inventory-list';
import { PersonalAdministrationPage } from './personal-administration/presentation/personal-administration.page';

import {ProvidersTable} from './providers-management/presentation/components/providers-table/providers-table';
import {ProviderComponent} from './shared/presentation/views/provider/provider';
import {SalesComponent} from './shared/presentation/views/sales/sales';


export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/presentation/views/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: HomeComponent },
      { path: 'inventory', component: InventoryListComponent },
      { path: 'inventario', component: InventoryListComponent },
      { path: 'proveedores', component: ProviderComponent },
      { path: 'venta', component: SalesComponent },
      { path: 'reportes', component: HomeComponent },
      { path: 'configuracion', component: HomeComponent },
      { path: 'perfil', component: PersonalAdministrationPage }
    ]
  },
  { path: '**', redirectTo: '' }
];
