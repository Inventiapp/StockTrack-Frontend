import { Routes } from '@angular/router';

/**
 * Lazy-loaded login component.
 */
const loginComponent = () =>
  import('./login/login').then(m => m.LoginComponent);

/**
 * Lazy-loaded register component.
 */
const registerComponent = () =>
  import('./register/register').then(m => m.RegisterComponent);

/**
 * Authentication routes configuration.
 * @remarks
 * These routes handle user authentication flows including login and registration.
 */
export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: loginComponent,
    title: 'Login - StockTrack'
  },
  {
    path: 'register',
    loadComponent: registerComponent,
    title: 'Register - StockTrack'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

