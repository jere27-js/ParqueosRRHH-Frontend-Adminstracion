
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../core/service/auth/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    styleUrl: './app.menu.component.scss'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];
    recursos: string[];

    constructor(public layoutService: LayoutService, private authService: AuthService,
            private confirmationService: ConfirmationService, private messageService: MessageService
     ) { }

    ngOnInit() {

        this.model = [
            {
                items: [
                    { label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        slug:'dashboard',
                        routerLink: ['/dashboard'] }
                ]
            },
         {
                items: [
                    { label: 'Parqueos',
                        icon: 'pi pi-building',
                        slug: 'parking-crud',
                        routerLink: ['/parking-crud']
                    },
                    {
                        label: 'Asignar Parqueos',
                        icon: 'pi pi-car',
                        slug: 'assign-parking',
                        routerLink: ['/assign-parking']
                    }
                ]
            },
            {
                items: [
                    {
                        label: 'Reportes',
                         icon: 'pi pi-book',
                         slug: 'management-reports',
                         routerLink: ['/management-reports/reports']
                    }
                ]
            },
            {
                icon: 'pi pi-fw pi-briefcase',
                items: [

                    {
                        label: 'Usuarios',
                        icon: 'pi pi-fw pi-users',
                        slug: 'users',
                        items: [
                            {
                                label: 'Roles',
                                icon: 'pi pi-id-card',
                                routerLink: ['/users/dashboard-role']
                            },
                            {
                                label: 'Gestion de Usuarios',
                                icon: 'pi pi-user-edit',
                                routerLink: ['/users']

                            }
                        ]
                    },
                ]
            },

            {
                items: [
                    {
                        label: 'Notificaciones',
                         icon: 'pi pi-send',
                         slug: 'management-notifications',
                         routerLink: ['/management-notifications/dashboard-notifications']
                    }
                ]
            },

            {
                icon: 'pi pi-fw pi-cog',
                items: [

                    {
                        label: 'Configuracion',
                        icon: 'pi pi-fw pi pi-fw pi-cog',
                        slug: 'management-parameters',
                        items: [
                            {
                                label: 'Grupos',
                                icon: 'pi pi-tags',
                                routerLink: ['/management-parameters/dashboard-tags']
                            },

                            {
                                label: 'Parámetros del Sistema',
                                icon: 'pi pi-sliders-h',
                                routerLink: ['/management-parameters/setting']
                            },
                            {
                                label: 'Administración de catálogos',
                                icon: 'pi pi-file-edit',
                                routerLink: ['/management-parameters/dashboard-catalog']
                            },
                            {
                                label: 'Notificaciones por Usuario',
                                icon: 'pi pi-bell',
                                routerLink: ['/management-parameters/user-notifications']
                            },
                            {
                                label: 'Plantillas de Correo',
                                icon: 'pi pi-sitemap',
                                routerLink: ['/management-parameters/template']
                            },
                        ]
                    },
                ]
            },
        ];

        //construye el menu según los recursos del token
        this.recursos = this.authService.setResourcesFromToken();

        this.model = this.model.map(group => ({
            items: group.items.filter(item => this.recursos.includes(item.slug))
        })).filter(group => group.items.length > 0); // Eliminar grupos vacíos


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

    onLogout() {
        this.recursos = [];
        this.authService.logout();
    }
}
