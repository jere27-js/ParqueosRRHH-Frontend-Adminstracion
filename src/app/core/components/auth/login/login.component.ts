import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/core/service/auth/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    invalidCredentials: string | null = null;
    isLoading = false;
    private destroy$ = new Subject<void>();
    private loginOfficeUrl = environment.loginOfficeUrl;
    private popup: Window | null = null;
    samlPopup: any;


    constructor(
        private auth: AuthService,
        private fb: FormBuilder,
        private router: Router,
        private http: HttpClient
    ) {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.setupSamlListener();

        if (this.auth.isAuthenticated()) {
            this.router.navigate(['/dashboard']);
            return;
        }

        setTimeout(() => {
            if (!this.auth.isAuthenticated()) {
                console.warn('No se recibió respuesta de autenticación 110');
            }
        }, 100000);
    }



    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        window.removeEventListener('message', this.handleSamlMessage.bind(this));

        try {
            this.samlPopup?.close();
        } catch (e) {
            console.debug('Error al cerrar popup:', e);
        } finally {
            this.samlPopup = null;
        }
    }


    private setupSamlListener(): void {
        window.addEventListener('message', this.handleSamlMessage.bind(this));
    }

    // En tu LoginComponent
    private handleSamlMessage(event: MessageEvent): void {
        const allowedOrigins = [
            'https://devparqueosrrhh.claro.com.gt',
            'http://localhost:4200',
            'https://api.devparqueosrrhh.claro.com.gt',
            'https://api.parqueosrrhh.claro.com.gt',
            'https://admin.parqueosrrhh.claro.com.gt',
        ];

        //console.log(' Mensaje recibido:', event.data);

        if (!allowedOrigins.some(origin => event.origin.includes(origin))) {
            console.warn(' Origen no permitido:', event.origin);
            return;
        }

        if (event.data?.type === 'SAML_AUTH_SUCCESS') {
            //console.log(' Autenticación SAML exitosa');

            // Procesar los tokens
            this.auth.handleSamlAuthSuccess(event.data.token, event.data.refreshToken);

            // Redirigir mediante el router de Angular (sin recarga)
            this.http.get('/api/v1/csrf/health', { withCredentials: true }).subscribe({
                next: () => this.router.navigate(['/dashboard']),
                error: () => this.router.navigate(['/dashboard'])
            });

            // Cerrar el popup si está abierto
            if (this.samlPopup && !this.samlPopup.closed) {
                this.samlPopup.close();
            }
        }
    }



    onLogin(): void {
        if (this.loginForm.invalid) return;

        this.isLoading = true;
        this.invalidCredentials = null;

        this.auth.login(this.loginForm.value)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.isLoading = false;
                    const payload = this.auth.getTokenPayload();

                    if (!payload || !payload.resources || payload.resources.length === 0) {
                        this.invalidCredentials = 'Error en la autenticación: Token inválido o sin recursos asignados.';
                        this.auth.clearSession(); // Limpiar sesión inválida
                        return;
                    }

                    // Redirigir según el rol
                    const targetRoute = payload.role ? '/dashboard' : '/';
                    this.http.get('/api/v1/csrf/health', { withCredentials: true }).subscribe({
                        next: () => this.router.navigate([targetRoute]),
                        error: () => this.router.navigate([targetRoute]) // fallback por si falla
                    });

                },
                error: (err) => {
                    this.isLoading = false;
                    this.invalidCredentials = 'Credenciales inválidas o error del servidor.';
                    console.error('Error en login:', err);
                }
            });
    }

    // En tu LoginComponent
    redirectToSaml(): void {
        const samlLoginUrl = this.loginOfficeUrl || 'https://api.devparqueosrrhh.claro.com.gt/api/v1/auth/saml/login';

        // Abrir popup de inmediato con características básicas
        this.samlPopup = window.open(
            samlLoginUrl,
            'samlLoginPopup',
            'width=600,height=700,top=100,left=100'
        );

        const startTime = Date.now();

        const fallbackInterval = setInterval(() => {
            if (this.auth.isAuthenticated()) {
                clearInterval(fallbackInterval);
                this.router.navigate(['/dashboard']);
            }
        }, 1000);
    }


    onLogout(): void {
        this.auth.logout();
    }
}
