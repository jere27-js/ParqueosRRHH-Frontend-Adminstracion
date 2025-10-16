import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/core/api/product';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { User } from 'src/app/core/api/user';
import { UserService } from 'src/app/core/service/user.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { NotificationsService } from 'src/app/core/service/notifications.service';

@Component({
    selector: 'app-usuarios',
    standalone: false,
    templateUrl: './users.component.html',
    providers: [MessageService, ConfirmationService, TagModule]
})
export class UsersComponent implements OnInit {

    id: string;
    userDetail: boolean = false;
    displayDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    users: User[] = [];
    user: User = {};
    selectedProducts: Product[] = [];
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    rowsPerPageOptions = [5, 10, 20];
    menuItems: MenuItem[] = [];
    loading = [false, false, false, false];
    formUser: FormGroup;
    roles: { label: string, value: string }[] = [];
    statusOptions: { nameStatus: string }[] = [];

    rowsPerPage = 5;
    totalRows = 0;
    page = 1;
    pageCounter = 0;
    eventRows = 0;

    get shouldScroll(): boolean {
        return this.totalRows > this.rowsPerPage;
    }

    updateTotalRows() {
        this.totalRows = this.users.length;
    }

    constructor(private router: Router, private messageService: MessageService, private userService: UserService, private fb: FormBuilder, private notificationsService: NotificationsService, private confirmationService: ConfirmationService) {
    }


    redirigir() {
        this.router.navigate(['users/create-user']);
    }

    openNew() {
        this.user = {};
        this.submitted = false;
        this.userDetail = true;
    }

    ngOnInit() {
        this.loadStatusOptions();
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Descripción' },
            { field: 'role.name', header: 'Rol' },
            { field: 'status.nameStatus', header: 'Estado' }
        ];
        this.id = this.userService.getUserId();
        this.loadRoles();
        this.loadUsers({ first: 0, rows: 20 }); 
    }

    // --- Paginacion dinamica ---
    loadUsers(event: any) {
        const page = event.first / event.rows + 1;
        const limit = event.rows;

        this.userService.getUserData(limit, page).subscribe({
            next: data => {
                this.users = data.data;
                this.totalRows = data.total;
                this.pageCounter = data.pageCounter;
                this.eventRows = limit;

                // Cargar todas las páginas si hay más
                const requests = [];
                for (let i = 1; i < this.pageCounter; i++) {
                    requests.push(this.userService.getUserData(limit, page + i));
                }

                let completed = 0;
                requests.forEach(req => {
                    req.subscribe({
                        next: additionalData => {
                            this.users = [...this.users, ...additionalData.data];
                            completed++;
                        }
                    });
                });
            },
            error: err => console.error(err)
        });
    }

    // --- Carga dinamica de roles---
    loadRoles(): void {
        const initialLimit = 20; 
        const initialPage = 1;

        this.userService.getRolData(initialLimit, initialPage).subscribe({
            next: (res) => {
                // Guardar roles de la primera página
                this.roles = res.data.map(role => ({ label: role.name, value: role.id }));

                // Si hay más páginas, se cargan dinámicamente
                if (res.pageCounter > 1) {
                    for (let i = 2; i <= res.pageCounter; i++) {
                        this.userService.getRolData(initialLimit, i).subscribe({
                            next: pageData => {
                                this.roles = [
                                    ...this.roles,
                                    ...pageData.data.map(role => ({ label: role.name, value: role.id }))
                                ];
                            },
                            error: err => console.error('Error fetching roles page', i, err)
                        });
                    }
                }
            },
            error: err => console.error('Error fetching roles:', err)
        });
    }


    loadStatusOptions(): void {
        this.userService.getStatusCatalog().subscribe({
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


    load(index: number) {
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
    }



    getSeverity(status: string) {
        switch (status) {
            case 'ACTIVO':
                return 'success';
            case 'INACTIVO':
                return 'danger';
            default:
                return 'unknown';
        }
    }


    phonePattern = /^[0-9\s*+\-(),]*$/;
    emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    formularioUsers = new FormGroup(
        {
            name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            username: new FormControl('', [Validators.required, Validators.maxLength(35)]),
            phone: new FormControl('', [Validators.maxLength(15), Validators.pattern(this.phonePattern)]),
            email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern), Validators.maxLength(50)]),
            status: new FormControl('', Validators.required),
            role: new FormControl('', Validators.required),
        }
    );

    viewUser(user: User) {
        this.userService.getUser(user.id).subscribe(response => {
            //console.log('User data:', response.data);
            this.formularioUsers.patchValue({
                name: response.data.name,
                username: response.data.username,
                email: response.data.email,
                phone: response.data.phone,
                status: response.data.status,
                role: response.data.role.id,
            });

            this.formularioUsers.disable();

            this.userDetail = true;
        });
    }

    onEdit(id: string) {
        this.userService.setUserId(id);
        this.router.navigate(['/users/edit-user']);
    }

    onViewParking(id: string) {
        this.userService.setUserId(id);

        this.router.navigate(['/pages/view-user']);
    }

    deleteProduct(user: User) {
        this.deleteProductDialog = true;
        this.user = { ...user };
    }

    deleteUser(id: string) {
        this.userService.deleteUser(id).subscribe(() => {
            this.users = this.users.filter(users => users.id !== id);
        }, error => {
        });
    }

    confirmDelete(user: User) {
        this.confirmationService.confirm({
            key: 'confirmDeleteUser',
            message: `¿Estás seguro de que deseas eliminar al usuario "${user.name}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",

            accept: () => {
                if (!user?.id) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'ID de usuario no disponible para eliminar.',
                        life: 3000
                    });
                    return;
                }

                this.notificationsService.getUserPreferences(user.id).subscribe(
                    (data) => {
                        const preferences = data?.notificationPreferences || [];
                        const hasActivePreferences = preferences.some((pref: any) => pref.enable === true);

                        if (hasActivePreferences) {
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Atención',
                                detail: 'Este usuario tiene preferencias de notificación activas. No puedes eliminarlo hasta desactivarlas.',
                                life: 4000
                            });
                            return;
                        }

                        this.userService.deleteUser(user.id).subscribe(
                            () => {
                                this.users = this.users.filter(val => val.id !== user.id);
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Correcto',
                                    detail: 'El usuario se ha eliminado',
                                    life: 3000
                                });
                            },
                            (error) => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'No se pudo eliminar el usuario',
                                    life: 3000
                                });
                            }
                        );
                    },
                    (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudieron cargar las preferencias de notificaciones para el usuario',
                            life: 3000
                        });
                    }
                );
            }
        });
    }


    hideDialog() {
        this.userDetail = false;
        this.submitted = false;
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

        table.filter('', 'anyField', 'custom');

        table.filterGlobal(inputValue, 'contains');
    }


    get list_of_access(): FormArray {
        return this.formUser.get('list_of_access') as FormArray;
    }

    getListOfAccess(): { resource: string, can_access: boolean }[] {
        return this.list_of_access.controls.map(control => ({
            resource: control.get('id').value || '', // Resource no es null
            can_access: control.get('can_access').value
        }));
    }


    setListOfAccess(resources: any[]) {
        const accessArray = this.formUser.get('list_of_access') as FormArray;
        accessArray.clear();
        resources.forEach(resource => {
            accessArray.push(this.fb.group({
                slug: { value: resource.slug, disabled: true },
                can_access: { value: resource.can_access, disabled: true }
            }));
        });
    }

}
