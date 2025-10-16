import { Component, OnInit } from '@angular/core';
import { TagsService } from 'src/app/core/service/tags/tags.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StatusItem } from 'src/app/core/api/management-catalog/catalog';

@Component({
    selector: 'app-create-tags',
    standalone: false,
    templateUrl: './create-tags.component.html',
    styleUrls: ['./create-tags.css'],
    providers: [MessageService, ConfirmationService],
})
export class CreateTagsComponent implements OnInit {
    formTags: FormGroup;
    statusOptions: { nameStatus: string }[] = [];

    constructor(
        private fb: FormBuilder,
        private tagsService: TagsService,
        private messageService: MessageService,
        private router: Router,
        private confirmationService: ConfirmationService
    ) {
        this.formTags = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(50)]],
            description: ['', [Validators.maxLength(255)]],
            status: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.loadStatusOptions();
    }

    loadStatusOptions(): void {
        this.tagsService.getStatusCatalog().subscribe({
            next: (response) => {
                this.statusOptions = response.data
                    .filter((item: StatusItem) => item.isActive)
                    .map((item: StatusItem) => ({
                        nameStatus: item.name,
                    }));
            },
            error: (error) => {
                console.error('Error al obtener estados:', error);
            },
        });
    }

    getFormData() {
        return this.formTags.value;
    }

    validateForm(): boolean {
        if (this.formTags.valid) {
            return true;
        } else {
            this.markFormGroupTouched(this.formTags);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Formulario inválido. Por favor, revisa los campos.',
            });
            return false;
        }
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    onSubmit() {
        if (this.validateForm()) {
            const tagData = this.getFormData();
            this.tagsService.createTag(tagData).subscribe(
                (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Grupo creado exitosamente.',
                        life: 1000,
                    });
                    setTimeout(() => {
                        this.router.navigate(['/management-parameters/dashboard-tags']);
                    }, 1000);
                },
                (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al crear el grupo.',
                    });
                }
            );
        }
    }

    confirm() {
        this.confirmationService.confirm({
            key: 'confirm',
            message: '¿Estás seguro que quieres crear el grupo?',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.onSubmit();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelado',
                    detail: 'Has cancelado la acción.',
                });
            },
        });
    }

    cancel() {
        this.confirmationService.confirm({
            key: 'cancel',
            message: '¿Estás seguro que quieres salir sin guardar los cambios?',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.router.navigate(['/management-parameters/dashboard-tags']);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelado',
                    detail: 'Has cancelado la acción guardar grupo.',
                });
            },
        });
    }
}
