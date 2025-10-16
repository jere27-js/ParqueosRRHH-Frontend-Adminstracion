import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { RolService } from 'src/app/core/service/rol.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-role',
    templateUrl: './create-role.component.html',
    styleUrls: ['./create-role.css'],
})
export class CreateRoleComponent implements OnInit {
    formRole: FormGroup;
    statusOptions: { nameStatus: string }[] = [];

    constructor(
        private fb: FormBuilder,
        private rolService: RolService,
        private messageService: MessageService,
        private router: Router,
        private confirmationService: ConfirmationService
    ) {
        this.formRole = this.fb.group({
            name: new FormControl('', [Validators.required, Validators.maxLength(35)]),
            description: new FormControl('', [Validators.maxLength(255)]),
            status: new FormControl('', [Validators.required]),
            listOfAccess: this.fb.array([]),
        });
    }

    ngOnInit(): void {
        this.loadStatusOptions();

        this.rolService.getAccessData().subscribe((response) => {
            const accessList = response.data.map((item) => ({
                resource: item.id,
                slug: item.slug,
                canAccess: false,
            }));

            // Marca "auth" y "dashboard" como true por defecto
            this.setListOfAccess(accessList);
        });
    }

    get listOfAccess(): FormArray {
        return this.formRole.get('listOfAccess') as FormArray;
    }

    loadStatusOptions(): void {
        this.rolService.getStatusCatalog().subscribe({
            next: (response) => {
                this.statusOptions = response.data
                    .filter((item: any) => item.isActive)
                    .map((item: any) => ({
                        nameStatus: item.name,
                        value: item.name,
                    }));
            },
            error: (error) => {
                console.error('Error al obtener estados:', error);
            },
        });
    }

    // accesos predeterminados
    setListOfAccess(accessList: { resource: string; slug: string; canAccess: boolean }[]): void {
        const accessFormArray = this.listOfAccess;
        accessFormArray.clear();

        accessList.forEach((access) => {
            const isMandatory = ['auth', 'dashboard'].includes(access.slug);

            const accessGroup = this.fb.group({
                resource: [access.resource],
                slug: [access.slug],
                canAccess: [isMandatory ? true : access.canAccess],
            });

            // Deshabilitar "canAccess" para "auth" y "dashboard"
            if (isMandatory) {
                accessGroup.get('canAccess').disable();
            }

            accessFormArray.push(accessGroup);
        });
    }

    addNewAccess(): void {
        const newAccessGroup = this.fb.group({
            resource: [''],
            slug: [''],
            canAccess: [false],
        });

        this.listOfAccess.push(newAccessGroup);
    }

    prepareFormData(): any {
        const formData = {
            name: this.formRole.get('name').value,
            description: this.formRole.get('description').value,
            status: this.formRole.get('status').value.nameStatus,
            listOfAccess: this.listOfAccess.controls.map((control) => ({
                resource: control.get('resource').value,
                canAccess: control.get('canAccess').value,
            })),
        };
        return formData;
    }

    onSubmit(): void {
        if (this.formRole.invalid) {
            this.formRole.markAllAsTouched();
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor, completa todos los campos correctamente.',
                life: 3000,
            });
            return;
        }

        // Verifica si al menos un acceso tiene canAccess: true
        const accessFormArray = this.listOfAccess;
        const hasAccessSelected = accessFormArray.controls.some(
            (control) => control.get('canAccess').value
        );

        if (!hasAccessSelected) {
            const dashboardControl = accessFormArray.controls.find(
                (control) => control.get('slug').value === 'dashboard'
            );
            if (dashboardControl) {
                dashboardControl.get('canAccess').setValue(true);
            }
        }

        const formData = this.prepareFormData();

        // Enviar los datos al backend
        this.rolService.createRole(formData).subscribe(
            (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Hecho',
                    detail: 'Rol creado Exitosamente!',
                    life: 1000,
                });
                setTimeout(() => {
                    this.router.navigate(['users/dashboard-role']);
                }, 1500);
            },
            (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo crear el Rol, intenta de nuevo.',
                    life: 3000,
                });
            }
        );
    }

    redirect(): void {
        this.router.navigate(['users/dashboard-role']);
    }

    confirm(): void {
        this.confirmationService.confirm({
            key: 'confirm',
            message: '¿Estás seguro de que quieres crear el Rol?',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.onSubmit();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Has cancelado la acción',
                });
            },
        });
    }

    confirm3(): void {
        this.confirmationService.confirm({
            key: 'confirm3',
            message: '¿Estás seguro de que quieres salir?',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.redirect();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Has cancelado la acción',
                });
            },
        });
    }
}
