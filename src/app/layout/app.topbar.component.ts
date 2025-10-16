import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { AuthService } from '../core/service/auth/auth.service';
import { Role } from '../core/api/role';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    user: string;
    rol: string;

    constructor(public layoutService: LayoutService, private auth: AuthService,
         private confirmationService: ConfirmationService, private messageService: MessageService
     ) { }

    ngOnInit() {

        const payload = this.auth.getTokenPayload();

        this.user = payload.user;
        this.rol = payload.role;

      }

      confirmLogout(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Estás seguro de cerrar sesión?',
            icon: 'pi pi-exclamation-circle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.onLogout();
            }
        });
    }

      onLogout(){
        this.auth.logout()
    }

}
