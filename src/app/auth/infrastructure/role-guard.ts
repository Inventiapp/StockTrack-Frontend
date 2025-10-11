import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { JwtTokenService } from './jwt-token';
import { AuthStore } from '../application/auth.store';

/**
 * Guard for protecting routes based on user roles.
 * @remarks
 * This guard checks if the user has the required role to access the route.
 * If the user is not authenticated, they are redirected to the login page.
 * If the user doesn't have the required role, they are redirected to an unauthorized page.
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(JwtTokenService);
  const router = inject(Router);
  const authStore = inject(AuthStore);

  if (!tokenService.hasToken() || tokenService.isTokenExpired()) {
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const currentUser = authStore.currentUser();
  const userRole = currentUser?.role;

  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
