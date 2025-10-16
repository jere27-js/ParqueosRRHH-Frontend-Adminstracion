import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManagementNotificationsService } from 'src/app/core/service/management-notifications/management-notifications.service';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-create-notifications',
    templateUrl: './create-notifications.component.html',
    styleUrls: ['./create-notifications.css'],
    providers: [MessageService, ConfirmationService, DatePipe],
    standalone: false,
})
export class CreateNotificationsComponent implements OnInit {
    notificationForm: FormGroup;
    tagsFromApi: { label: string; value: string }[] = [];
    recipientSelected: string = '';
    activeUsers: { label: string; value: number }[] = [];
    isLoading: boolean = false;
    today: Date;
    threeMonthsFromToday: Date;

    constructor(
        private fb: FormBuilder,
        private managementNotificationsService: ManagementNotificationsService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.today = new Date();
        this.threeMonthsFromToday = new Date();
        this.threeMonthsFromToday.setMonth(this.today.getMonth() + 3);

        this.notificationForm = this.fb.group({
            subject: ['', [Validators.required, Validators.maxLength(50)]],
            message: ['', [Validators.required, Validators.maxLength(500)]],
            scheduleNotification: [false],
            notificationDate: [null],
            recipient: ['', [Validators.required]],
            users: [[]],
            groups: [[]],
        });

        this.loadActiveUsers();
        this.loadTagsFromApi();
    }

    loadActiveUsers() {
        this.managementNotificationsService.getAllUsers(100, 1).subscribe({
            next: (response) => {
                this.activeUsers = response.data.map((user: any) => ({
                    label: user.email,
                    value: user.id,
                }));
            },
            error: (err) =>
                this.handleError(err, 'No se pudieron cargar los usuarios activos.'),
        });
    }

    loadTagsFromApi(): void {
        this.managementNotificationsService.getAllTag(100, 1).subscribe({
            next: (response) => {
                this.tagsFromApi = response.data
                    .filter((tag: any) => tag.status === 'ACTIVO')
                    .map((tag: any) => ({
                        label: tag.name,
                        value: tag.id,
                    }));
            },
            error: (err) =>
                this.handleError(err, 'No se pudieron cargar grupos activos.'),
        });
    }

    onRecipientChange(value: string) {
        this.recipientSelected = value;
        if (value === 'group') {
            this.notificationForm.get('users')?.reset([]);
            this.notificationForm.get('users')?.clearValidators();
            this.notificationForm.get('groups')?.setValidators([Validators.required]);
        } else if (value === 'individual') {
            this.notificationForm.get('groups')?.reset([]);
            this.notificationForm.get('groups')?.clearValidators();
            this.notificationForm.get('users')?.setValidators([Validators.required]);
        } else if (value === 'all') {
            this.notificationForm.get('users')?.reset([]);
            this.notificationForm.get('groups')?.reset([]);
            this.notificationForm.get('users')?.clearValidators();
            this.notificationForm.get('groups')?.clearValidators();
        }
        this.notificationForm.get('users')?.updateValueAndValidity();
        this.notificationForm.get('groups')?.updateValueAndValidity();
    }

    confirm() {
        this.confirmationService.confirm({
            key: 'confirm',
            message: '¿Estás seguro de que quieres enviar la notificación?',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.onSubmit();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Acción cancelada',
                    detail: 'El envío de la notificación ha sido cancelado.',
                });
            },
        });
    }

    cancel() {
        this.confirmationService.confirm({
            key: 'cancel',
            message: '¿Estás seguro de que quieres cancelar sin guardar los cambios?',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.router.navigate([
                    '/management-notifications/dashboard-notifications',
                ]);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Acción cancelada',
                    detail: 'No se cancelaron los cambios.',
                });
            },
        });
    }

    onSubmit() {
        if (this.notificationForm.valid) {
            const formData = { ...this.notificationForm.value };

            if (formData.scheduleNotification) {
                if (
                    !formData.notificationDate ||
                    new Date(formData.notificationDate).getTime() <= new Date().getTime()
                ) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'La fecha programada debe ser posterior a la fecha actual.',
                    });
                    return;
                }
            }

            this.isLoading = true;

            if (formData.scheduleNotification && formData.notificationDate) {
                const notificationDateLocal = new Date(formData.notificationDate);
                const notificationDateUTC = new Date(notificationDateLocal.getTime() - (notificationDateLocal.getTimezoneOffset() * 60000));
                formData.notificationDate = notificationDateUTC.toISOString();
            }

            this.sendNotification(formData);
        } else {
            this.notificationForm.markAllAsTouched();

            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El formulario contiene errores. Por favor, verifica.',
            });
        }
    }

    sendNotification(data: any) {
        let notificationData: any;
        let sendFunction;

        const normalizeArray = (arr: any[]) =>
            arr.map((item) => (typeof item === 'object' && item !== null ? item.value : item)).filter(Boolean);

        if (data.recipient === 'group' && (!Array.isArray(data.groups) || data.groups.length === 0)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Debes seleccionar al menos un grupo.',
            });
            return;
        }

        if (data.scheduleNotification && data.notificationDate) {
            switch (data.recipient) {
                case 'individual':
                    notificationData = {
                        subject: data.subject,
                        message: data.message,
                        recipientType: 'individual',
                        recipientId: normalizeArray(data.users).join(','),
                        isScheduled: true,
                        notificationDate: data.notificationDate,
                    };
                    sendFunction = this.managementNotificationsService.createScheduledTagsNotification(notificationData);
                    break;

                case 'group':
                    notificationData = {
                        subject: data.subject,
                        message: data.message,
                        recipientType: 'tag',
                        recipientId: normalizeArray(data.groups).join(','),
                        isScheduled: true,
                        notificationDate: data.notificationDate,
                    };
                    sendFunction = this.managementNotificationsService.createScheduledTagsNotification(notificationData);
                    break;

                case 'all':
                    notificationData = {
                        subject: data.subject,
                        message: data.message,
                        recipientType: 'all',
                        isScheduled: true,
                        notificationDate: data.notificationDate,
                    };
                    sendFunction = this.managementNotificationsService.createScheduledAllNotification(notificationData);
                    break;

                default:
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Tipo de destinatario no válido.',
                    });
                    return;
            }
        } else {
            switch (data.recipient) {
                case 'individual':
                    notificationData = {
                        subject: data.subject,
                        message: data.message,
                        recipientType: 'individual',
                        recipientId: normalizeArray(data.users).join(','),
                        isScheduled: false,
                    };
                    sendFunction = this.managementNotificationsService.sendNotificationIndividual(notificationData);
                    break;

                case 'group':
                    notificationData = {
                        subject: data.subject,
                        message: data.message,
                        recipientType: 'tag',
                        recipientId: normalizeArray(data.groups).join(','),
                        isScheduled: false,
                    };
                    sendFunction = this.managementNotificationsService.sendNotificationTags(notificationData);
                    break;

                case 'all':
                    notificationData = {
                        subject: data.subject,
                        message: data.message,
                        recipientType: 'all',
                        isScheduled: false,
                    };
                    sendFunction = this.managementNotificationsService.sendNotificationAll(notificationData);
                    break;

                default:
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Tipo de destinatario no válido.',
                    });
                    return;
            }
        }

        sendFunction.subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: data.isScheduled
                        ? 'Notificación programada exitosamente.'
                        : 'Notificación enviada exitosamente.',
                    life: 1000,
                });
                this.isLoading = false;
                this.notificationForm.reset();
                this.recipientSelected = '';

                setTimeout(() => {
                    this.router.navigate([
                        '/management-notifications/dashboard-notifications',
                    ]);
                }, 1000);
            },
            error: (err) => {
                this.handleError(err, 'Error al enviar la notificación. No se pueden enviar notificaciones a grupos sin usuarios.');
                this.isLoading = false;
            },
        });
    }

    handleError(err: any, customMessage: string) {
        console.error(customMessage, err);
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: customMessage,
        });
    }
}
