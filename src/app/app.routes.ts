import { Routes } from '@angular/router';
import { HomeComponent } from './shared/presentation/views/home/home';
import { InventoryListComponent } from './inventory/presentation/inventory-list/inventory-list';
import { PersonalAdministrationPage } from './personal-administration/presentation/personal-administration.page';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'inventario', component: InventoryListComponent },
  { path: 'proveedores', component: HomeComponent },
  { path: 'venta', component: HomeComponent },
  { path: 'reportes', component: HomeComponent },
  { path: 'configuracion', component: HomeComponent },
  { path: 'perfil', component: PersonalAdministrationPage },
  { path: '**', redirectTo: '' }
];
