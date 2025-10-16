import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';

import { User, notificationsPreferences } from 'src/app/core/api/notifications';
import { UserService } from 'src/app/core/service/user.service';
import { NotificationsService } from 'src/app/core/service/notifications.service';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-user-notifications',
    standalone: false,
    templateUrl: './user-notifications.component.html',
    providers: [MessageService, InputSwitchModule],
    styleUrl: 'user-notifications.component.css',
})

export class UserNotificationsComponent implements OnInit {
    users: User[] = [];
    formGroup: FormGroup | undefined;
    selectedUser: User | null = null;
    userPreferences: any;
    originalPreferences: any;
    isUpdating: false;
    private formChangesSubscription: Subscription;
    private userSubscription: Subscription;

    totalRows: number = 0;
    pageCounter: number = 0;
    eventRows: number = 0;


    formNotifications: FormGroup;

    constructor(
        private userService: UserService,
        private messageService: MessageService,
        private fb: FormBuilder,
        private notificationsService: NotificationsService
    ) {
        this.formNotifications = this.fb.group({
            ACCEPTANCE_FORM: new FormControl<boolean>(false),
            ACCEPTANCE_ASSIGNMENT: new FormControl<boolean>(false),
            MANUAL_DE_ASSIGNMENT: new FormControl<boolean>(false),
            AUTO_DE_ASSIGNMENT: new FormControl<boolean>(false),
            DISCOUNT_NOTE: new FormControl<boolean>(false),
            ASSIGNMENT_LOAN: new FormControl<boolean>(false),
            DE_ASSIGNMENT_LOAN: new FormControl<boolean>(false),
            REMINDER_DISCOUNT_NOTE: new FormControl<boolean>(false),
            ONDEMAND_NOTIFICATION:  new FormControl<boolean>(false),
            DISCOUNT_NOTE_ESCALATION: new FormControl<boolean>(false),
        });

        this.formGroup = new FormGroup({
            selectedUser: new FormControl<User | null>(null),
        });
    }
    loadUserPreferences(userId: string) {
        this.notificationsService.getUserPreferences(userId).subscribe(
            (data) => {

                if (!data || !data.notificationPreferences || !Array.isArray(data.notificationPreferences)) {
                    console.error('Estructura inesperada en la respuesta:', data);
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: 'No se han encontrado preferencias configuradas para este usuario.',
                    });
                    return;
                }

                const preferences = data.notificationPreferences;

                // Validar si el arreglo  está vacío
                if (preferences.length === 0) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Advertencia',
                        detail: 'No se han encontrado preferencias configuradas para este usuario.',
                    });
                    return;
                }

                // Asignar preferencias al componente
                this.userPreferences = data;

                // Guardamos las preferencias originales de forma segura
                this.originalPreferences = preferences.map((preference) => ({
                    notificationType: preference.notificationType,
                    enable: preference.enable,
                }));

                // Configurar valores en el formulario
                preferences.forEach((preference) => {
                    const control = this.formNotifications.get(preference.notificationType);
                    if (control) {
                        control.setValue(preference.enable, { emitEvent: false });
                    } else {
                        console.warn(`Control no encontrado para: ${preference.notificationType}`);
                    }
                });

                this.messageService.add({
                    severity: 'success',
                    summary: 'Correcto',
                    detail: 'Se han cargado las preferencias del usuario correctamente.',
                });

                // Manejar cambios en el formulario
                if (this.formChangesSubscription) {
                    this.formChangesSubscription.unsubscribe();
                }
                this.formChangesSubscription = this.formNotifications.valueChanges
                    .pipe(distinctUntilChanged())
                    .subscribe(() => {
                        // Detecta cambios cuando el formulario cambia
                        this.detectChanges();
                    });
            },
            (error) => {

                console.error('Error al obtener las preferencias del usuario:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al obtener las preferencias del usuario.',
                });
            }
        );
    }

    ngOnInit() {
        this.getUserData();

        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }

        this.userSubscription = this.formGroup
            .get('selectedUser')
            ?.valueChanges.subscribe((value) => {
                this.selectedUser = value;
                if (this.selectedUser) {
                    this.loadUserPreferences(this.selectedUser.id);
                } else {
                    // Limpiar el formulario si selectedUser es null
                    this.formNotifications.reset({
                        ACCEPTANCE_ASSIGNMENT: false,
                        ACCEPTANCE_FORM: false,
                        ASSIGNMENT_LOAN: false,
                        AUTO_DE_ASSIGNMENT: false,
                        DE_ASSIGNMENT_LOAN: false,
                        DISCOUNT_NOTE: false,
                        MANUAL_DE_ASSIGNMENT: false,
                        REMINDER_DISCOUNT_NOTE: false,
                        ONDEMAND_NOTIFICATION: [false],
                        DISCOUNT_NOTE_ESCALATION: [false],
                    });
                }
            });

        // Desuscribirse de la suscripción anterior si existe
        if (this.formChangesSubscription) {
            this.formChangesSubscription.unsubscribe();
        }

        // Suscribirse a los cambios en el formulario
        this.formChangesSubscription =
            this.formNotifications.valueChanges.subscribe((changes) => {
                // Solo llama a updateUserPreferences si no está en proceso de actualización
                if (!this.isUpdating) {
                    this.updateUserPreferences();
                }
            });
    }

    // Recuerda añadir el manejo de suscripciones en ngOnDestroy
    ngOnDestroy() {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.formChangesSubscription) {
            this.formChangesSubscription.unsubscribe();
        }
    }

   getUserData(event: any = { first: 0, rows: 20 }) {
    const page = event.first / event.rows + 1;
    const limit = event.rows;

    this.userService.getUserData(limit, page).subscribe({
        next: (res) => {
            // Filtrar usuarios con estado "INACTIVO"
            this.users = res.data.filter(user => user.status !== 'INACTIVO');

            // Paginación dinámica
            this.totalRows = res.total;
            this.pageCounter = res.pageCounter;
            this.eventRows = limit;

            // Traer páginas adicionales si existen
            const requests = [];
            for (let i = 1; i < this.pageCounter; i++) {
                requests.push(this.userService.getUserData(limit, page + i));
            }

            let completed = 0;
            requests.forEach(req => {
                req.subscribe({
                    next: additionalData => {
                        this.users = [
                            ...this.users,
                            ...additionalData.data.filter(u => u.status !== 'INACTIVO')
                        ];
                        completed++;
                    },
                    error: err => console.error(err)
                });
            });
        },
        error: (err) => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al traer la información de la Base de datos, revisa tu conexión.',
            });
            console.error(err);
        },
    });
}

    onSubmit() {
       // console.log(this.formNotifications.value);
    }

    updateUserPreferences() {
        if (this.selectedUser) {
            const preferences = Object.keys(this.formNotifications.value).map(
                (key) => ({
                    notificationType: key,
                    enable: this.formNotifications.value[key],
                })
            );

            const payload = { preferences };

            this.notificationsService
                .updateUserPreferences(this.selectedUser.id, payload)
                .subscribe(
                    (response) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Correcto',
                            detail: 'Se ha editado satisfactoriamente la notificación',
                        });

                        // Actualiza las preferencias originales después de la actualización
                        this.originalPreferences = JSON.parse(JSON.stringify(preferences));
                    },
                    (error) => {
                        // Muestra un mensaje de error
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error al actualizar la información',
                        });
                    }
                );
        }
    }

    detectChanges() {
        const preferences = Object.keys(this.formNotifications.value).map(
            (key) => ({
                notificationType: key,
                enable: this.formNotifications.value[key],
            })
        );

        // Comparar preferencias con las originales
        const hasChanges = !this.arePreferencesEqual(
            preferences,
            this.originalPreferences
        );

        if (hasChanges) {
            this.updateUserPreferences();
        }
    }

    arePreferencesEqual(preferences, originalPreferences) {
        if (preferences.length !== originalPreferences.length) {
            return false;
        }

        // Comparar cada preferencia individualmente
        for (let i = 0; i < preferences.length; i++) {
            const p = preferences[i];
            const o = originalPreferences.find(
                (op) => op.notificationType === p.notificationType
            );
            if (!o || o.enable !== p.enable) {
                return false;
            }
        }

        return true;
    }
}
