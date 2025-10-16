import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ManagementNotificationsService } from 'src/app/core/service/management-notifications/management-notifications.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-dashboard-notifications',
    templateUrl: './dashboard-notifications.component.html',
    styleUrls: ['./dashboard-notifications.css'],
    providers: [MessageService, DatePipe],
    standalone: false,
})
export class DashboardNotificationsComponent implements OnInit {
    notifications: any[] = [];
    filteredNotifications: any[] = [];
    selectedNotification: any | null = null;
    totalRecords: number = 0;  // Total de notificaciones
    selectedNotifications: any[] = [];
    displayNotificationDialog: boolean = false;
    searchQuery: string = '';
    filteredRecipients: string[] = [];
    isReloadAction: boolean = false;


    page: number = 1;
    limit: number = 5;

    constructor(
        private managementNotificationsService: ManagementNotificationsService,
        private messageService: MessageService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadNotifications();
    }

    // Cargar las notificaciones
    loadNotifications(): void {
        this.managementNotificationsService.getAllNotifications(this.limit, this.page).subscribe({
            next: (response) => {
                if (response?.data && Array.isArray(response.data)) {
                    this.notifications = response.data;
                    this.filteredNotifications = [...this.notifications];
                } else {
                    this.notifications = [];
                    this.filteredNotifications = [];
                }
                this.totalRecords = response?.total ?? 0;

                if (this.isReloadAction) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Actualización exitosa',
                        detail: 'Datos actualizados exitosamente',
                        life: 2000
                    });
                    this.isReloadAction = false;
                }
            },
            error: (err) => {
                console.error('Error al cargar notificaciones:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar las notificaciones.',
                });

                this.notifications = [];
                this.filteredNotifications = [];
                this.totalRecords = 0;

                this.isReloadAction = false;
            },
        });
    }

    reloadNotifications(): void {
        this.isReloadAction = true;
        this.loadNotifications();
    }

    // Filtro de búsqueda
    applyFilter(filterValue: string): void {
        const lowerCaseFilter = filterValue.toLowerCase();
        this.filteredNotifications = this.notifications.filter((notification) => {
            const notificationDate = notification.notificationDate
                ? new Date(notification.notificationDate).toLocaleDateString().toLowerCase()
                : '';
            const notificationStatus = notification.emailStatus ? notification.emailStatus.toLowerCase() : '';
            const notificationMessage = notification.message ? notification.message.toLowerCase() : '';
            const notificationSubject = notification.subject ? notification.subject.toLowerCase() : '';

            return notificationMessage.includes(lowerCaseFilter) ||
                notificationDate.includes(lowerCaseFilter) ||
                notificationStatus.includes(lowerCaseFilter) ||
                notificationSubject.includes(lowerCaseFilter);
        });
    }

    // Crear notificación
    createNotifications(): void {
        this.router.navigate(['/management-notifications/create-notifications']);
    }

    getNotificationDisplayData(emailStatus: string): { label: string; severity: string } {
        switch (emailStatus) {
            case 'SENT':
                return { label: 'Enviado', severity: 'success' };
            case 'PENDING':
                return { label: 'Pendiente', severity: 'warning' };
            case 'FAILED':
                return { label: 'Fallido', severity: 'danger' };
            default:
                return { label: 'Desconocido', severity: 'info' };
        }
    }

    // filtrar los destinatarios
    filterRecipients(): void {
        if (this.selectedNotification?.recipients) {
            const recipientsArray = this.selectedNotification.recipients.split(',').map(item => item.trim());
            this.filteredRecipients = recipientsArray.filter(recipient => recipient.toLowerCase().includes(this.searchQuery.toLowerCase()));
        }
    }

    // Ver notificacion
    viewNotification(notification: any): void {
        this.selectedNotification = { ...notification };
        this.filteredRecipients = this.selectedNotification?.recipients?.split(',').map(item => item.trim()) || [];
        this.displayNotificationDialog = true;
    }

    // Cerrar el cuadro de diálogo
    hideDialog(): void {
        this.displayNotificationDialog = false;
        this.selectedNotification = null;
    }
}
