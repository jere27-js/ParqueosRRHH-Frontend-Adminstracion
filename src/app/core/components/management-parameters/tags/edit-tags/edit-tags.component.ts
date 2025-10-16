import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TagsService } from 'src/app/core/service/tags/tags.service';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { Tags } from 'src/app/core/api/tags/tags';
import { ActivatedRoute } from '@angular/router';
import { StatusItem } from 'src/app/core/api/management-catalog/catalog';

@Component({
    selector: 'app-edit-tags',
    templateUrl: './edit-tags.component.html',
    styleUrls: ['./edit-tags.css'],
    providers: [MessageService, ConfirmationService],
    standalone: false
})
export class EditTagsComponent implements OnInit {
    formTag: FormGroup;
    tagId: string;
    tag: Tags;
    statusOptions: { nameStatus: string }[] = [];


    constructor(
        private fb: FormBuilder,
        private tagsService: TagsService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private confirmationService: ConfirmationService
    ) {
        this.formTag = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(35)]],
            description: ['', [Validators.maxLength(255)]],
            status: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.loadStatusOptions();
        this.tagId = this.tagsService.getTagsId();
        if (this.tagId) {
            this.loadTag(this.tagId);
        } else {
            console.error("No se encontró el ID del Grupo.");
            this.router.navigate(['/management-parameters/dashboard-tags']);
        }
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

    loadTag(tagId: string): void {
        this.tagsService.getTags(tagId).subscribe({
            next: (response: any) => {
                const tag = response.data;
                this.formTag.patchValue({
                    name: tag.name,
                    description: tag.description,
                    status: tag.status,
                });
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo cargar el Grupo.'
                });
                this.router.navigate(['/management-parameters/dashboard-tags']);
            }
        });
    }

    confirmUpdate(): void {
        if (this.formTag.valid) {
            this.confirmationService.confirm({
                message: '¿Estás seguro de que deseas actualizar el Grupo?',
                key: 'confirm',
                acceptLabel: 'Sí',
                rejectLabel: 'No',
                rejectButtonStyleClass: 'p-button-text',
                accept: () => {
                    const updatedTag = this.formTag.value;
                    if (this.tagId) {
                        this.tagsService.updateTags(this.tagId, updatedTag).subscribe({
                            next: (response) => {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Éxito',
                                    detail: 'Grupo actualizado correctamente.',
                                });
                                setTimeout(() => {
                                    this.router.navigate(['/management-parameters/dashboard-tags']);
                                }, 1000);
                            },
                            error: (error) => {
                                console.error('Error al actualizar el Grupo:', error);

                                if (error.status === 400) {
                                    this.messageService.add({
                                        severity: 'error',
                                        summary: 'Error',
                                        detail: 'El estado del grupo no puede establecerse como inactivo debido a que tiene usuarios asignados.',
                                    });
                                } else {
                                    this.messageService.add({
                                        severity: 'error',
                                        summary: 'Error',
                                        detail: 'No se pudo actualizar el Grupo.',
                                    });
                                }
                            },
                        });
                    } else {
                        console.error('El id del  grupo no está definido. No se puede actualizar el Grupo.');
                    }
                },
                reject: () => {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Acción cancelada',
                        detail: 'No se han realizado cambios.',
                    });
                },
            });
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Por favor, revisa los campos antes de continuar.',
            });
        }
    }
    confirmCancel(): void {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que deseas salir sin guardar los cambios?',
            key: 'cancel',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.router.navigate(['/management-parameters/dashboard-tags']);
            },
            reject: () => {
                this.messageService.add({ severity: 'info', summary: 'Acción cancelada', detail: 'No se han realizado cambios.' });
            }
        });
    }
}
