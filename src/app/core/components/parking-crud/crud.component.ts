import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ParkingService } from 'src/app/core/service/parking.service';
import { Parking } from 'src/app/core/api/parkings';
import { SelectItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { StatusItem } from 'src/app/core/api/management-catalog/catalog';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService, ConfirmationService, TableModule, TagModule, RatingModule, ButtonModule, CommonModule]
})
export class CrudComponent implements OnInit {

    id: string;
    productDialog: boolean = false;
    deleteProductDialog: boolean = false;
    deleteProductsDialog: boolean = false;
    parkings: Parking[] = [];
    parking: Parking = {};
    submitted: boolean = false;
    cols: any[] = [];
    statuses: any[] = [];
    menuItems: MenuItem[] = [];
    loading = [false, false, false, false];
    status_parkings: { nameStatus: string }[] = [];
    eventRows: number = 0; 
    // acumulador de todos los registros
    allParkings: Parking[] = [];

    pageCounter: number = 0;
    rowsPerPage = 5;
    totalRows = 0;
    rowsPerPageOptions: number[] = [5, 10, 20];

    get shouldScroll(): boolean {
        return this.totalRows > this.rowsPerPage;
    }

    constructor(
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private parkingService: ParkingService
    ) { }

   

    loadParkingLocations(event: any): Promise<any> {
        const page = event.first / event.rows + 1;
        const limit = event.rows;

        return this.parkingService.getParkingData(limit, page)
            .then(data => {
                // Página actual
                this.allParkings = data.data || [];
                this.parkings = this.allParkings;

                // Total de registros y contador de páginas
                this.pageCounter = data.pageCounter || 1;
                this.totalRows = (this.pageCounter - 1) * limit + this.allParkings.length;
                this.eventRows = event.rows;

                // Solicitudes para las páginas restantes
                const requests: Promise<any>[] = [];
                for (let i = 1; i < this.pageCounter; i++) {
                    const nextPage = page + i;
                    requests.push(this.parkingService.getParkingData(limit, nextPage));
                }

                // Ejecutar todas las páginas restantes
                return Promise.all(requests)
                    .then(responses => {
                        responses.forEach(res => {
                            this.allParkings = [...this.allParkings, ...(res.data || [])];
                            this.parkings = this.allParkings;
                        });
                        return this.allParkings;
                    });
            })
            .catch(err => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo obtener la información de parqueos.'
                });
                return [];
            });
    }



    redirigir() {
        this.router.navigate(['parking-crud/create-parking']);
    }

    statusOptions: SelectItem[] = [];
    selected_drop: SelectItem = { value: '' };

    ngOnInit() {
        this.cols = [
            { field: 'name', header: 'name' },
            { field: 'availableSlots', header: 'availableslots' },
            { field: 'occupiedSlots', header: 'occupiedslots' },
            { field: 'unavailableSlots', header: 'unavailablslots' },
            { field: 'status', header: 'status' },
            { field: 'actions', header: 'actions' }
        ];

        this.loadStatusOptions();

        // Cargar primera página dinámicamente
        this.loadParkingLocations({ first: 0, rows: this.rowsPerPage });
    }

    loadStatusOptions(): void {
        this.parkingService.getStatusCatalog().subscribe({
            next: (response) => {
                this.status_parkings = response.data
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

    load(index: number) {
        this.loading[index] = true;
        setTimeout(() => this.loading[index] = false, 1000);
    }

    editProduct(parking: Parking) {
        this.parking = { ...parking };
        this.productDialog = true;
    }

    onEdit(id: string) {
        this.parkingService.setParkingId(id);
        this.router.navigate(['parking-crud/edit-parking']);
    }

    onViewParking(id: string) {
        this.parkingService.setParkingId(id);
        this.router.navigate(['parking-crud/view-parking']);
    }

    deleteProduct(parking: Parking) {
        this.confirmDelete(parking);
    }

    deleteParking() {
        if (this.parking.occupiedSlots > 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puede eliminar el parqueo porque tiene slots ocupados', life: 3000 });
            return;
        }

        this.parkingService.deleteLocation(this.parking.id).subscribe(
            () => {
                this.parkings = this.parkings.filter(p => p.id !== this.parking.id);
                this.allParkings = this.allParkings.filter(p => p.id !== this.parking.id); // mantener acumulador en sync
                this.totalRows = this.allParkings.length; //  actualizar total
                this.messageService.add({ severity: 'success', summary: 'Hecho', detail: 'Parqueo eliminado con éxito', life: 3000 });
                this.parking = {};
            },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el parqueo', life: 3000 });
                console.error('Error al eliminar el parqueo', error);
            }
        );
    }

    confirmDelete(parking: Parking) {
        this.parking = parking;
        this.confirmationService.confirm({
            key: 'confirm',
            message: `¿Estás seguro que quieres eliminar el parqueo: ${parking.name}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.deleteParking();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelado',
                    detail: 'No se eliminó el parqueo',
                });
            }
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    findIndexById(id: string): number {
        return this.parkings.findIndex(p => p.id === id);
    }

    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        table.filter('', 'anyField', 'custom');
        table.filterGlobal(inputValue, 'contains');
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
}
