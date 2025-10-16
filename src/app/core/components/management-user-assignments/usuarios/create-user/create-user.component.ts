import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { UserService, Role } from 'src/app/core/service/user.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { InputMaskModule } from 'primeng/inputmask';
import { StatusItem } from 'src/app/core/api/role';


@Component({
    selector: 'app-create-user',
    standalone: false,
    templateUrl: './create-user.component.html',
    styleUrl: './create-user.css',
    providers: [MessageService, ConfirmationService, InputMaskModule]
})
export class CreateUserComponent implements OnInit {

    roles: { label: string, value: string }[] = [];
    statusOptions: { nameStatus: string }[] = [];

    constructor(private userService: UserService, private messageService: MessageService, private router: Router, private confirmationService: ConfirmationService) { }

    ngOnInit(): void {
        this.loadStatusOptions();
        this.loadRoles();
    }

    loadRoles(): void {
        const initialLimit = 20;
        const initialPage = 1;

        // Traer la primera página
        this.userService.getRolData(initialLimit, initialPage).subscribe({
            next: (res) => {
                // Guardar roles activos de la primera página
                this.roles = res.data
                    .filter(role => role.status !== 'INACTIVO')
                    .map(role => ({ label: role.name, value: role.id }));

                // Si hay más páginas, se cargan dinámicamente
                if (res.pageCounter > 1) {
                    for (let i = 2; i <= res.pageCounter; i++) {
                        this.userService.getRolData(initialLimit, i).subscribe({
                            next: pageData => {
                                this.roles = [
                                    ...this.roles,
                                    ...pageData.data
                                        .filter(role => role.status !== 'INACTIVO')
                                        .map(role => ({ label: role.name, value: role.id }))
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
                this.status = response.data
                    .filter((item: StatusItem) => item.isActive)
                    .map((item: StatusItem) => ({
                        nameStatus: item.name,
                        value: item.name,
                    }));
            },
            error: (error) => {
                console.error('Error al obtener estados:', error);
            },
        });
    }

    redirect() {

        this.router.navigate(["/users"]);

    }


    status: SelectItem[] = [];


    phonePattern = /^[0-9\s*+\-(),]*$/;
    emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;




    formularioUsers = new FormGroup(
        {
            name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            username: new FormControl('', [Validators.required, Validators.maxLength(35)]),
            phone: new FormControl('', [Validators.required, Validators.maxLength(15), Validators.pattern(this.phonePattern)]),
            email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern), Validators.maxLength(50)]),
            status: new FormControl('', Validators.required),
            role: new FormControl('', Validators.required),
        }
    );

    getFormData(): any {
        return this.formularioUsers.value;
    }

    validateForm(): boolean {
        if (this.formularioUsers.valid) {
            return true;
        } else {
            this.markFormGroupTouched(this.formularioUsers);
            return false;
        }
    }


    private markFormGroupTouched(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }


    submitForm() {
        if (this.validateForm()) {
            const formData = this.getFormData();
            this.userService.createUser(formData).subscribe(
                response => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado exitosamente.', life: 1000 });
                    setTimeout(() => {
                        this.redirect();
                    }, 1500);

                },
                error => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el usuario.' });

                }
            );
        } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Formulario Inválido' });
        }
    }

    confirm(): void {
        this.confirmationService.confirm({
            key: 'confirm',
            message: '¿Estás seguro de que quieres crear el usuario?',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.submitForm();
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
