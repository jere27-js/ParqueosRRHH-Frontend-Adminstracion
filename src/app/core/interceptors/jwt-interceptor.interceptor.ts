import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();
        const csrfToken = this.getCSRFToken();

        const headers: { [key: string]: string } = {};

        if (token) {
            headers['authorization'] = token; // SIN prefijo Bearer
        }

        const method = req.method.toUpperCase();
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method) && csrfToken) {
            headers['x-csrf-token'] = csrfToken;
        }

        const clonedRequest = req.clone({
            setHeaders: headers,
            withCredentials: true
        });

        return next.handle(clonedRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 &&
                    error.error?.message?.includes('Token revocado. Por favor inicia sesión nuevamente.')) {
                    this.authService.triggerRevokedTokenModal();
                }
                return throwError(() => error);
            })
        );
    }

    private getCSRFToken(): string | null {
        const match = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrfToken='));
        return match ? decodeURIComponent(match.split('=')[1]) : null;
    }
}
