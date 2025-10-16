import { Component, OnInit, OnDestroy } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './core/service/auth/auth.service';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
    user$ = this.authService.user$;

    // Modal de inactividad
    showTimeoutModal = false;
    timeoutProgress = 100;
    remainingSeconds = 30;

    // Modal de token revocado
    showRevokedTokenModal = false;

    currentRoute = '';

    private modalSubscription!: Subscription;
    private progressSubscription!: Subscription;
    private revokedTokenSubscription!: Subscription;
    private routerSubscription!: Subscription;

    constructor(
        private primengConfig: PrimeNGConfig,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
        this.authService.initializeSession();
        this.authService.startInactivityWatcher();

        this.routerSubscription = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.currentRoute = event.urlAfterRedirects;
        });

        // Modal de inactividad
        this.modalSubscription = this.authService.showTimeoutModal$.subscribe(show => {
            if (show && this.currentRoute !== '/') {
                this.showTimeoutModal = true;
            } else {
                this.showTimeoutModal = false;
            }
        });

        // Progreso modal inactividad
        this.progressSubscription = this.authService.responseProgress$.subscribe(value => {
            // value es un número válido entre 0 y 100
            const safeValue = Math.min(100, Math.max(0, value ?? 0));
            this.timeoutProgress = safeValue;

            // Calcula segundos restantes (inverso del progreso)
            const totalSeconds = this.authService['responseTimeLimit'] / 1000;
            this.remainingSeconds = Math.ceil(totalSeconds * (1 - safeValue / 100));
        });


        // Modal token revocado
        this.revokedTokenSubscription = this.authService.showRevokedTokenModal$.subscribe(show => {
            this.showRevokedTokenModal = show;
        });
    }

    handleTimeoutResponse(keepSession: boolean) {
        this.authService.respondToInactivity(keepSession);
    }

    handleReLogin() {
        this.authService.hideRevokedTokenModal(); // Oculta el modal
        this.authService.clearSession();          // Limpia sesión
        this.router.navigate(['/']);              // Redirige al login o raíz
    }


    ngOnDestroy() {
        this.modalSubscription.unsubscribe();
        this.progressSubscription.unsubscribe();
        this.revokedTokenSubscription.unsubscribe();
        this.routerSubscription.unsubscribe();
    }


}
