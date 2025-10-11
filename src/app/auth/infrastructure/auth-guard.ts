import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { JwtTokenService } from './jwt-token';

/**
 * Guard for protecting routes that require authentication.
 * @remarks
 * This guard checks if the user has a valid JWT token before allowing access to protected routes.
 * If the user is not authenticated, they are redirected to the login page with a returnUrl parameter.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(JwtTokenService);
  const router = inject(Router);

  if (tokenService.hasToken() && !tokenService.isTokenExpired()) {
    return true;
  }

  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
