import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { TagsService } from 'src/app/core/service/tags/tags.service';
import { TagResponse, Tags } from 'src/app/core/api/tags/tags';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { StatusItem } from 'src/app/core/api/management-catalog/catalog';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-dashboard-tags',
    templateUrl: './dashboard-tags.component.html',
    styleUrls: ['./dashboard-tags.css'],
    providers: [MessageService, ConfirmationService],
    standalone: false,
})
export class DashboardTagsComponent implements OnInit {

    groups: Tags[] = [];
    allGroups: Tags[] = [];

    cols: any[] = [];
    formTags: FormGroup;
    TagsDetail: boolean = false;
    statusOptions: { nameStatus: string }[] = [];

    pageCounter: number = 0;
    rowsPerPage: number = 5;
    totalRows: number = 0;
    rowsPerPageOptions: number[] = [5, 10, 20];
    eventRows: number = 0;

    constructor(
        private tagsService: TagsService,
        private messageService: MessageService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.formTags = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            status: ['', Validators.required],
        });

        this.cols = [
            { field: 'name', header: 'Nombre' },
            { field: 'description', header: 'Descripción' },
            { field: 'status', header: 'Estado' },
            { field: 'actions', header: 'Acciones' },
        ];

        this.loadStatusOptions();
        this.loadGroups({ first: 0, rows: this.rowsPerPage });
    }

    loadStatusOptions(): void {
        this.tagsService.getStatusCatalog().subscribe({
            next: (response) => {
                this.statusOptions = response.data
                    .filter((item: StatusItem) => item.isActive)
                    .map((item: StatusItem) => ({ nameStatus: item.name }));
            },
            error: (error) => console.error('Error al obtener estados:', error)
        });
    }

    getSeverity(status: string) {
        switch (status) {
            case 'ACTIVO': return 'success';
            case 'INACTIVO': return 'danger';
            default: return 'unknown';
        }
    }

    async loadGroups(event: any = { first: 0, rows: 5 }): Promise<void> {
        const page = event.first / event.rows + 1;
        const limit = event.rows;

        try {
            const data: TagResponse = await firstValueFrom(this.tagsService.getTagsData(limit, page));
    
            this.allGroups = Array.isArray(data.data) ? [...data.data] : [];
            this.groups = [...this.allGroups];

            this.pageCounter = data.pageCounter || 1;
            this.totalRows = (this.pageCounter - 1) * limit + this.allGroups.length;
            this.eventRows = event.rows;

            // Cargar páginas restantes
            const requests: Promise<TagResponse>[] = [];
            for (let i = 1; i < this.pageCounter; i++) {
                const nextPage = page + i;
                requests.push(firstValueFrom(this.tagsService.getTagsData(limit, nextPage)));
            }

            const responses = await Promise.all(requests);
            responses.forEach(res => {
                if (Array.isArray(res.data)) {
                    this.groups = [...this.groups, ...res.data];
                }
            });

        } catch (err) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo obtener la información de grupos.'
            });
            this.groups = [];
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
        table.filterGlobal(value, 'contains');
    }

    onAddNewGroup() {
        this.router.navigate(['/management-parameters/create-tags']);
    }

    onEdit(tag: Tags) {
        this.tagsService.setTagsId(tag.id);
        this.router.navigate(['/management-parameters/edit-tags']);
    }

    onView(tag: Tags) {
        this.tagsService.getTags(tag.id).subscribe({
            next: (res: TagResponse) => {
                if (res.data) {
                    this.formTags.patchValue({
                        name: res.data.name,
                        description: res.data.description,
                        status: res.data.status
                    });
                    this.TagsDetail = true;
                }
            },
            error: (err) => console.error('Error al obtener el tag:', err)
        });
    }

    hideDialog() {
        this.TagsDetail = false;
    }

    onDelete(group: Tags) {
        this.confirmationService.confirm({
            key: 'confirmDeleteTag',
            message: `¿Estás seguro de que deseas eliminar el grupo "${group.name}"?`,
            header: 'Confirmar eliminación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.tagsService.deleteTags(group.id).subscribe(
                    () => {
                        this.loadGroups({ first: 0, rows: this.rowsPerPage });
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Grupo eliminado exitosamente!'
                        });
                    },
                    () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se puede eliminar el grupo, porque tiene usuarios asignados.'
                        });
                    }
                );
            }
        });
    }
}
