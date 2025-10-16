import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/api/product';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Role } from 'src/app/core/api/role';
import { RolService } from 'src/app/core/service/rol.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-dashboard-role',
    templateUrl: './dashboard-role.component.html',
    providers: [MessageService, TableModule, TagModule, RatingModule, ButtonModule, CommonModule]
})
export class DashboardRoleComponent implements OnInit {

    id: string;
    rolDetail: boolean = false;
    displayDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    roles: Role[] = [];
    role: Role = {};
    selectedProducts: Product[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    menuItems: MenuItem[] = [];
    loading = [false, false, false, false];
    formRole: FormGroup;
    statusOptions: { nameStatus: string }[] = [];

    rowsPerPage = 5;
    totalRoles = 0;

    get shouldScrollRoles(): boolean {
        return this.totalRoles > this.rowsPerPage;
    }

    updateTotalRoles() {
        this.totalRoles = this.roles.length;
    }

    constructor(private router: Router, private confirmationService: ConfirmationService, private messageService: MessageService, private rolService: RolService, private fb: FormBuilder) {
        this.formRole = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            status: ['', Validators.required],
            listOfAccess: this.fb.array([])
        });
        this.formRole.get('name').disable();
        this.formRole.get('description').disable();
        this.formRole.get('status').disable();
    }

    loadRoles(): void {
        const initialLimit = 20;
        const initialPage = 1;

        // Traer la primera página
        this.rolService.getRolData(initialLimit, initialPage).subscribe({
            next: (res) => {

                this.roles = res.data;

                // Si hay más páginas, las cargamos dinámicamente
                if (res.pageCounter > 1) {
                    const requests = [];
                    for (let i = 2; i <= res.pageCounter; i++) {
                        requests.push(this.rolService.getRolData(initialLimit, i));
                    }

                    requests.forEach(req => {
                        req.subscribe({
                            next: pageData => {
                                // Agregamos los roles de la página actual al array
                                this.roles = [...this.roles, ...pageData.data];
                            },
                            error: err => console.error('Error fetching additional roles:', err)
                        });
                    });
                }
            },
            error: err => console.error('Error fetching roles:', err)
        });
    }



    redirigir() {
        this.router.navigate(['users/dashboard-role/create-role']);
    }

    openNew() {
        this.role = {};
        this.submitted = false;
        this.rolDetail = true;
    }

    selected_drop: SelectItem = { value: '' };

    ngOnInit() {

        this.id = this.rolService.getRoleId();

        if (this.id) {
            this.rolService.getRole(this.id).subscribe(response => {
                this.formRole.patchValue({
                    name: response.data.name,
                    description: response.data.description,
                    status: response.data.status,
                });
                //  console.log("Valor de status en el formulario:", this.formRole.value.status);

                this.formRole.get('name').disable();
                this.formRole.get('description').disable();
                this.formRole.get('status').disable();

                this.setListOfAccess(response.data.resources);
                const accessArray = this.formRole.get('listOfAccess') as FormArray;
                accessArray.controls.forEach(control => {
                    control.get('canAccess').disable();
                });
            });
        } else {
            // ID no disponible o incorrecto
            this.messageService.add({
                severity: 'error',
                summary: 'ID no válido',
                detail: 'El ID del rol no es válido o no se pudo obtener.'
            });
        }

        // obtener todos los roles
        this.loadRoles();

        this.loadStatusOptions();
        this.cols = [
            { field: 'name', header: 'name' },
            { field: 'description', header: 'description' },
            { field: 'status', header: 'status' },
            { field: 'actions', header: 'actions' }
        ];

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


    getSeverity(statusOptions: string) {
        switch (statusOptions) {
            case 'ACTIVO':
                return 'success';
            case 'INACTIVO':
                return 'danger';
            default:
                return 'unknown';
        }
    }

    load(index: number) {
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
    }


    viewRole(role: Role) {
        this.rolService.getRole(role.id).subscribe(response => {
            //  console.log('Rol obtenido:', response);
            this.formRole.patchValue({
                name: response.data.name,
                description: response.data.description,
                status: response.data.status,
            });

            this.setListOfAccess(response.data.resources);
            this.rolDetail = true;
        });
    }

    onEdit(id: string) {
        this.rolService.setRoleId(id);
        this.router.navigate(['users/dashboard-role/edit-role']);
    }

    onViewParking(id: string) {
        this.rolService.setRoleId(id);

        this.router.navigate(['users/dashboard-role/view-parking']);
    }


    deleteRole(id: string) {
        this.rolService.deleteRole(id).subscribe(() => {
            this.roles = this.roles.filter(roles => roles.id !== id);
        }, error => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el Rol.' })
        });
    }


    hideDialog() {
        this.rolDetail = false;
        this.submitted = false;
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.roles.length; i++) {
            if (this.roles[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }


    confirmDeleteRole(role: Role) {
        this.role = role;

        this.confirmationService.confirm({
            key: 'confirmDeleteRole',
            message: `¿Estás seguro que deseas eliminar el Rol: ${role.name}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => this.executeDeleteRole(),
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelado',
                    detail: 'No se eliminó el rol.',
                    life: 3000
                });
            }
        });
    }

    executeDeleteRole() {
        this.rolService.deleteRole(this.role.id).subscribe(
            () => {
                this.roles = this.roles.filter(val => val.id !== this.role.id);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'El Rol se ha eliminado correctamente',
                    life: 3000
                });
                this.role = {};
            },
            () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo eliminar el rol. Verifica que no esté asignado a ningún usuario.',
                    life: 3000
                });
            }
        );
    }

    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

        table.filter('', 'anyField', 'custom');

        table.filterGlobal(inputValue, 'contains');
    }


    get listOfAccess(): FormArray {
        return this.formRole.get('listOfAccess') as FormArray;
    }

    getListOfAccess(): { resource: string, canAccess: boolean }[] {
        return this.listOfAccess.controls.map(control => ({
            resource: control.get('id').value || '', // Asegúrate de que resource no sea null
            canAccess: control.get('canAccess').value
        }));
    }

    setListOfAccess(resources: any[]) {
        const accessArray = this.formRole.get('listOfAccess') as FormArray;
        accessArray.clear();
        resources.forEach(resource => {
            accessArray.push(this.fb.group({
                slug: { value: resource.slug, disabled: true },
                canAccess: { value: resource.canAccess, disabled: true }
            }));
        });
    }

}
