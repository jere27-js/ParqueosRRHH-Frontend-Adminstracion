import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // ✅ Verificación de autenticación
  if (!authService.isAuthenticated()) {
    //console.warn('Usuario no autenticado. Redirigiendo al login.');
    return router.parseUrl('/');
  }

  // ✅ Extrae el primer segmento de la URL para verificar permisos
  const routeSlug = state.url.replace(/^\//, '').split('/')[0];
  //console.log('Ruta solicitada:', routeSlug);

  // ✅ Verificación de acceso usando el método del servicio
  if (authService.hasAccessToRoute(routeSlug)) {
    //console.log(`✅ Acceso permitido a la ruta: ${routeSlug}`);
    return true;
  }
  console.warn(`🚫 Acceso denegado a la ruta: ${routeSlug}`);
  return router.parseUrl('/auth/access'); // Redirige si no tiene acceso

};
