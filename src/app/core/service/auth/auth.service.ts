import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as JwtDecode from 'jwt-decode';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiUrlService } from '../apiUrl/api-url.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userSubject = new BehaviorSubject<any>(null);
    user$ = this.userSubject.asObservable();

    private resources: string[] = [];
    private authLogin: string;
    private authLogout: string;
    private authRefresh: string;
    private tokenRefreshInterval: any;

    // Variables para gestión de inactividad
    private inactivityTimeLimit = 5 * 60 * 1000; // 5 minutos
    private responseTimeLimit = 30 * 1000; // 30 segundos para responder
    private inactivityTimer: any;
    private modalResponseTimer: any;
    private isTimeoutModalActive = false;
    private modalEndTime!: number; 

    private showTimeoutModalSubject = new BehaviorSubject<boolean>(false);
    public showTimeoutModal$ = this.showTimeoutModalSubject.asObservable();

    // Progreso 30 segundos
    private responseProgressSubject = new BehaviorSubject<number>(0);
    public responseProgress$ = this.responseProgressSubject.asObservable();

    //token revocado
    private showRevokedTokenModalSubject = new BehaviorSubject<boolean>(false);
    public showRevokedTokenModal$ = this.showRevokedTokenModalSubject.asObservable();



    constructor(
        private http: HttpClient,
        private apiUrlService: ApiUrlService,
        private cookieService: CookieService,
        private router: Router
    ) {
        this.authLogin = this.apiUrlService.apiAuthLogin();
        this.authLogout = this.apiUrlService.apiAuthlogout();
        this.initializeSession();
        this.setupTokenRefresh();
    }

    /** 🔑 Inicia sesión con el backend */
    login(credentials: { username: string; password: string }): Observable<any> {
        return this.http
            .post(this.authLogin, credentials, {
                observe: 'response',
                withCredentials: true,
                headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            })
            .pipe(
                tap(() => {
                    this.setResourcesFromToken();
                    this.setupTokenRefresh();
                })
            );
    }

    /** Inicia monitoreo de inactividad */
    startInactivityWatcher(): void {
        this.resetInactivityTimer();
        window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
        window.addEventListener('keydown', this.resetInactivityTimer.bind(this));
        window.addEventListener('click', this.resetInactivityTimer.bind(this));
    }

    /** Reinicia el temporizador de inactividad */
    private resetInactivityTimer(): void {
        if (this.isTimeoutModalActive) return;

        clearTimeout(this.inactivityTimer);
        clearInterval(this.modalResponseTimer);
        this.responseProgressSubject.next(0);

        this.inactivityTimer = setTimeout(() => {
            this.isTimeoutModalActive = true;
            this.showTimeoutModalSubject.next(true);

            const totalMs = this.responseTimeLimit;
            this.modalEndTime = Date.now() + totalMs; // momento exacto en que expira

            this.modalResponseTimer = setInterval(() => {
                const remaining = this.modalEndTime - Date.now(); //tiempo real que queda
                const progress = Math.min(100, ((totalMs - remaining) / totalMs) * 100);
                this.responseProgressSubject.next(progress);

                if (remaining <= 0) {
                    clearInterval(this.modalResponseTimer);
                    this.respondToInactivity(false);
                }
            }, 100);
        }, this.inactivityTimeLimit);
    }


    /** Usuario responde al modal de inactividad */
    respondToInactivity(continueSession: boolean): void {
        clearTimeout(this.modalResponseTimer);
        this.isTimeoutModalActive = false; // Desactivar la bandera
        this.showTimeoutModalSubject.next(false);

        if (continueSession) {
            this.resetInactivityTimer(); // continúa la sesión
        } else {
            this.logout(); // finaliza sesión
        }
    }

    // En tu AuthService
    handleSamlAuthSuccess(token: string, refreshToken: string): void {
        // Guardar los tokens en cookies
        this.cookieService.set('token', token, {
            path: '/',
            domain: '.claro.com.gt',
            secure: true,
            sameSite: 'None',
        });

        this.cookieService.set('refresh_token', refreshToken, {
            path: '/',
            domain: '.claro.com.gt',
            secure: true,
            sameSite: 'None',
        });

        // Actualizar el estado de autenticación
        this.setResourcesFromToken();
        this.userSubject.next(this.getTokenPayload());
    }

    /** 🛡️ Verifica si el usuario está autenticado */
    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload: any = JwtDecode.jwtDecode(token);
            return payload.exp * 1000 > Date.now();
        } catch (error) {
            console.error('Token inválido:', error);
            return false;
        }
    }

    /** 🧩 Decodifica el token */
    getTokenPayload(): any | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JwtDecode.jwtDecode(token);
            // Verifica que el payload tenga la estructura esperada
            if (!payload || typeof payload !== 'object') {
                console.error('Token payload inválido');
                return null;
            }
            return payload;
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            return null;
        }
    }

    /** 🔄 Configura el refresco automático del token */
    private setupTokenRefresh(): void {
        if (this.tokenRefreshInterval) {
            clearInterval(this.tokenRefreshInterval);
        }

        this.tokenRefreshInterval = setInterval(() => {
            if (this.shouldRefreshToken()) {
                this.refreshToken().subscribe({
                    error: (err) => {
                        console.error('Error al refrescar token:', err);
                        this.clearSession();
                    },
                });
            }
        }, 300000); // Verifica cada 5 minutos
    }

    /** ⏳ Determina si debe refrescarse el token */
    private shouldRefreshToken(): boolean {
        if (!this.isAuthenticated()) return false;

        const payload = this.getTokenPayload();
        const expTime = payload.exp * 1000;
        const now = Date.now();
        const timeLeft = expTime - now;

        return timeLeft < 1800000; // 30 minutos restantes
    }

    /** 🔄 Refresca el token */
    refreshToken(): Observable<any> {
        return this.http
            .post(
                this.authRefresh,
                {},
                {
                    withCredentials: true,
                }
            )
            .pipe(
                tap(() => {
                    this.setResourcesFromToken();
                })
            );
    }

    /** 📂 Manejo de recursos del token */
    setResourcesFromToken(): string[] {
        const payload = this.getTokenPayload();
        this.resources = payload?.resources || [];
        this.userSubject.next(payload || null);
        return this.resources;
    }

    getResources(): string[] {
        return this.resources;
    }

    hasAccessToRoute(slug: string): boolean {
        return this.resources.includes(slug);
    }

    /** 🔑 Obtiene el token desde la cookie */
    getToken(): string | null {
        return this.cookieService.get('token') || null;
    }

    /** 🚪 Cierra la sesión */
    logout(): void {
        this.http
            .post(
                this.authLogout,
                {},
                {
                    withCredentials: true,
                }
            )
            .subscribe({
                next: () => this.clearSession(),
                error: () => this.clearSession(),
            });
    }

    /** 🧹 Limpia la sesión */
    public clearSession(): void {
        // Limpiar cookies con el dominio correcto
        this.cookieService.delete('token', '/', '.claro.com.gt');
        this.cookieService.delete('refresh_token', '/', '.claro.com.gt');
        this.cookieService.delete('csrfToken', '/', '.claro.com.gt');

        // Limpiar estado local
        this.resources = [];
        this.userSubject.next(null);

        // Detener el refresco automático
        if (this.tokenRefreshInterval) {
            clearInterval(this.tokenRefreshInterval);
        }

        this.router.navigate(['/']);
    }

    /** 🚀 Inicializa la sesión */
    public initializeSession(): void {
        const token = this.getToken();
        if (token && this.isAuthenticated()) {
            try {
                const payload = this.getTokenPayload();
                this.resources = payload?.resources || [];
                this.userSubject.next(payload || null);

                // Verificar si tenemos los recursos necesarios
                if (!payload || !payload.resources || payload.resources.length === 0) {
                    console.warn('Token válido pero sin recursos asignados');
                    this.clearSession();
                }
            } catch (error) {
                console.error('Error al inicializar sesión:', error);
                this.clearSession();
            }
        } else {
            this.userSubject.next(null);
        }
    }

    /** ⏳Obtiene tiempo restante del token */
    getTokenExpirationTime(): string {
        const payload = this.getTokenPayload();
        if (!payload?.exp) return 'Token inválido';

        const expTime = payload.exp * 1000;
        const now = Date.now();
        const timeLeft = expTime - now;

        if (timeLeft <= 0) return 'El token ha expirado';

        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);

        return `Expira en ${minutes} min ${seconds} seg`;
    }

    triggerRevokedTokenModal(): void {
        this.showRevokedTokenModalSubject.next(true);
    }

    hideRevokedTokenModal(): void {
        this.showRevokedTokenModalSubject.next(false);
    }

}
