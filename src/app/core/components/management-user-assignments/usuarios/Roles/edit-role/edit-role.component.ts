import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Role } from 'src/app/core/api/role';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { RolService } from 'src/app/core/service/rol.service';
import { SelectItem } from 'primeng/api';
import { UnaryOperator } from '@angular/compiler';

@Component({
    selector: 'app-edit-role',
    standalone: false,
    templateUrl: './edit-role.component.html',
    styleUrl: './edit-role.css',
    providers: [MessageService, ConfirmationService]
})
export class EditRoleComponent implements OnInit {

    formRole: FormGroup;
    id: string;
    statusOptions: { nameStatus: string }[] = [];

    constructor(private fb: FormBuilder, private rolService: RolService, private messageService: MessageService, private router: Router, private confirmationService: ConfirmationService) {
        this.formRole = this.fb.group({
            name: new FormControl('', [Validators.required, Validators.maxLength(35)]),
            description: new FormControl('', [Validators.maxLength(255)]),
            status: new FormControl('', [Validators.required]),
            listOfAccess: this.fb.array([])
        });
    }

    redirect() {
        localStorage.removeItem('roleId');
        this.router.navigate(["users/dashboard-role"]);
    }

    ngOnInit(): void {
        this.loadStatusOptions();
        this.id = this.rolService.getRoleId() || localStorage.getItem('roleId');
        localStorage.setItem('roleId', this.id);

        this.rolService.getRole(this.id).subscribe(response => {
            // console.log(response);
            this.formRole.patchValue({
                name: response.data.name,
                description: response.data.description,
                status: response.data.status,
            });

            this.setListOfAccess(response.data.resources);
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

                // console.log('Opciones de estado cargadas:', this.statusOptions);
            },
            error: (error) => {
                console.error('Error al obtener estados:', error);
            },
        });
    }

    setListOfAccess(accessList: { id: string, resource: string, slug: string, canAccess: boolean }[]): void {
        const accessFormArray = this.listOfAccess;
        accessFormArray.clear();

        accessList.forEach(access => {
            const isMandatory = ['dashboard', 'auth'].includes(access.slug);

            const accessGroup = this.fb.group({
                id: access.id,
                resource: [access.resource],
                slug: [access.slug],
                canAccess: [{ value: access.canAccess, disabled: isMandatory }]
            });

            accessFormArray.push(accessGroup);
        });
    }

    getListOfAccess(): { resource: string, canAccess: boolean }[] {
        return this.listOfAccess.getRawValue().map(control => ({
            resource: control.id || '',
            canAccess: control.canAccess
        }));
    }

    validateChanges(originalData: any, updatedData: any): boolean {
        return JSON.stringify(originalData) !== JSON.stringify(updatedData);
    }

    validateFormData(data: any): boolean {
        if (!data.name || !data.status || !data.listOfAccess) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Revise los campos requeridos en el formulario' });
            return false;
        }
        return true;
    }

    updateRoleIfChanged(roleId: string, updatedData: any): void {
        this.rolService.getRole(roleId).subscribe(originalData => {
            if (this.validateChanges(originalData.data, updatedData)) {
                this.rolService.updateRole(roleId, updatedData).subscribe(response => {
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'El rol se editó correctamente' });
                    localStorage.removeItem('roleId'); // Eliminar el id del localStorage
                    setTimeout(() => {
                        this.router.navigate(["users/dashboard-role"]);
                    }, 1000);
                }, error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al intentar editar el rol' });
                });
            } else {
                this.messageService.add({ severity: 'info', summary: 'Info', detail: 'No hay cambios realizados, no se requiere actualizar el rol' });
            }
        }, error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al traer la data anterior' });
        });

    }

    onSubmit(): void {
        const updatedData = {
            name: this.formRole.value.name,
            description: this.formRole.value.description,
            status: this.formRole.value.status,
            listOfAccess: this.getListOfAccess()
        };

        if (this.validateFormData(updatedData)) {
            this.updateRoleIfChanged(this.id, updatedData);
        }
    }

    confirm2() {
        this.confirmationService.confirm({
            key: 'confirm2',
            message: '¿Estás segur@ de actualizar el Rol?',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.onSubmit();
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado la acción' });
            }
        });
    }

    confirm3() {
        this.confirmationService.confirm({
            key: 'confirm3',
            message: '¿Estas seguro que quieres salir?',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.redirect()
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has Cancelado la acción' });
            }
        });

    }

}



