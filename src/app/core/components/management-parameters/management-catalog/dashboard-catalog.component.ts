import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CatalogService } from 'src/app/core/service/management-catalog/catalog.service';
import { ManagementNotificationsService } from 'src/app/core/service/management-notifications/management-notifications.service';
@Component({
    selector: 'app-dashboard-catalog',
    templateUrl: './dashboard-catalog.component.html',
    styleUrls: ['./dashboard-catalog.css'],
    providers: [MessageService, ConfirmationService],
    standalone: false,
})
export class DashboardCatalogComponent implements OnInit {
    selectedCategory: string = '';
    dataList: any[] = [];
    displayDialog: boolean = false;
    displayConfirmDialog: boolean = false;
    displayRestrictionDialog: boolean = false;
    restrictionMessage: string = '';
    newItem: any = {};
    itemToEdit: any = null;
    itemToDelete: any = null;
    tempName: string = '';
    formSubmitted: boolean = false;


    menuItems = [
        { key: 'status', label: 'Estado', icon: 'pi pi-check-square', command: () => this.loadData('status') },
        { key: 'benefitType', label: 'Tipo de Beneficio', icon: 'pi pi-money-bill', command: () => this.loadData('benefitType') },
        { key: 'vehicleType', label: 'Tipo de Vehículo', icon: 'pi pi-car', command: () => this.loadData('vehicleType') },
        { key: 'slotType', label: 'Tipo de Espacio', icon: 'pi pi-cog', command: () => this.loadData('slotType') },
        { key: 'slotStatus', label: 'Estados de asignación por espacio', icon: 'pi pi-clock', command: () => this.loadData('slotStatus') }
    ];

    categoryNames = {
        status: 'Estado',
        benefitType: 'Tipo de Beneficio',
        vehicleType: 'Tipo de Vehículo',
        slotType: 'Tipo de Espacio',
        slotStatus: 'Estados de asignación por espacio'
    };

    protectedItems: Record<string, Set<string>> = {
        'benefitType': new Set(['complemento', 'descuento', 'sin costo']),
        'status': new Set(['activo', 'inactivo']),
        'slotType': new Set(['multiple', 'simple']),
        'slotStatus': new Set(['ocupado', 'disponible', 'no disponible']),
    };


    categoryMethods = {
        status: {
            get: () => this.catalogService.getStatusCatalog(),
            add: (item) => this.catalogService.addStatusItem(item),
            update: (item) => this.catalogService.updateStatusItem(item),
            delete: (id) => this.catalogService.deleteStatusItem(id),
        },
        benefitType: {
            get: () => this.catalogService.getBenefitTypeCatalog(),
            add: (item) => this.catalogService.addBenefitType(item),
            update: (item) => this.catalogService.updateBenefitType(item),
            delete: (id) => this.catalogService.deleteBenefitType(id),
        },
        vehicleType: {
            get: () => this.catalogService.getVehicleTypeCatalog(),
            add: (item) => this.catalogService.addVehicleType(item),
            update: (item) => this.catalogService.updateVehicleType(item),
            delete: (id) => this.catalogService.deleteVehicleType(id),
        },
        slotType: {
            get: () => this.catalogService.getSlotTypeCatalog(),
            add: (item) => this.catalogService.addSlotType(item),
            update: (item) => this.catalogService.updateSlotType(item),
            delete: (id) => this.catalogService.deleteSlotType(id),
        },
        slotStatus: {
            get: () => this.catalogService.getSlotStatusCatalog(),
            add: (item) => this.catalogService.addSlotStatus(item),
            update: (item) => this.catalogService.updateSlotStatus(item),
            delete: (id) => this.catalogService.deleteSlotStatus(id),
        }
    };


    constructor(
        private catalogService: CatalogService,
        private managementNotificationsService: ManagementNotificationsService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
    ) { }

    ngOnInit() {
        this.selectedCategory = 'status';
        this.loadData(this.selectedCategory);
    }


    loadData(categoryKey: string): void {
        this.selectedCategory = categoryKey;
        this.dataList = [];
        this.tempName = '';
        const method = this.categoryMethods[categoryKey]?.get;

        if (method) {
            method().subscribe(
                (response) => {
                    //console.log('Respuesta API:', response);

                    this.dataList = response.data?.map((item: any) => {
                        if (item.name === 'SIN_COSTO') {
                            item.name = 'SIN COSTO';
                        }
                        return item;
                    }) || [];
                },
                (error) => console.error(`Error al obtener ${categoryKey}:`, error)
            );
        } else {
            console.error('Categoría no válida:', categoryKey);
        }

        // Quitar la clase 'active' de todos los elementos del menú
        const menuItems = document.querySelectorAll('.menu-bar li');
        menuItems.forEach(item => item.classList.remove('active'));

        // Buscar el elemento del menú que corresponde a la categoría seleccionada y agregarle 'active'
        const selectedItem = Array.from(menuItems).find(item =>
            item.textContent?.trim() === this.categoryNames[categoryKey]
        );

        if (selectedItem) {
            selectedItem.classList.add('active');
        }
    }

    checkRestrictions(item: any, action: 'edit' | 'delete'): boolean {
        const itemName = item.name.toLowerCase();
        if (this.protectedItems[this.selectedCategory]?.has(itemName)) {
            this.restrictionMessage = `Este ítem no puede ser ${action === 'edit' ? 'editado' : 'eliminado'}.`;
            this.displayRestrictionDialog = true;
            return true;
        }
        return false;
    }

    showDialog(item?: any): void {
        if (item && this.checkRestrictions(item, 'edit')) return;

        // Definir los valores predeterminados dentro del método
        const defaultValues = {
            status: { name: this.tempName, description: '', isActive: false },
            benefitType: { name: this.tempName, description: '', sendDocument: false, allowAmount: false, isActive: false },
            vehicleType: { name: this.tempName, description: '', isActive: false },
            slotType: { name: this.tempName, description: '', allowParallelAssignments: false, isActive: false },
            slotStatus: { name: this.tempName, description: '', isActive: false }
        };

        const defaultItem = defaultValues[this.selectedCategory];
        this.itemToEdit = item ? { ...item } : null;
        this.newItem = item ? { ...item } : { ...defaultItem };
        this.displayDialog = true;
    }

    saveItem(): void {
        this.formSubmitted = true;


        if (!this.newItem.name || this.newItem.name.trim() === '') {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre es obligatorio' });
            return;
        }

        if (this.selectedCategory === 'benefitType') {
            if (this.newItem.sendDocument === null || this.newItem.sendDocument === undefined) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo "Requiere Documento" es obligatorio' });
                return;
            }
            if (this.newItem.allowAmount === null || this.newItem.allowAmount === undefined) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo "Permite Monto" es obligatorio' });
                return;
            }
        }

        if (this.selectedCategory === 'slotType') {
            if (this.newItem.allowParallelAssignments === null || this.newItem.allowParallelAssignments === undefined) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El campo "Espacio Múltiple" es obligatorio' });
                return;
            }
        }

        this.newItem.name = this.newItem.name.toUpperCase();

        const method = this.itemToEdit
            ? this.categoryMethods[this.selectedCategory]?.update
            : this.categoryMethods[this.selectedCategory]?.add;

        if (method) {
            method(this.newItem).subscribe((response) => {
                this.refreshData();
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Elemento guardado correctamente' });
                this.formSubmitted = false;
            });
        }
    }

    confirmDeleteItem(item: any): void {
        if (this.checkRestrictions(item, 'delete')) return;

        this.itemToDelete = item;
        this.displayConfirmDialog = true;
    }

    deleteItemConfirmed(): void {
        const method = this.categoryMethods[this.selectedCategory]?.delete;

        if (method) {
            method(this.itemToDelete.id).subscribe({
                next: () => {
                    this.refreshData();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Elemento eliminado correctamente'
                    });
                    this.displayConfirmDialog = false;
                    this.itemToDelete = null;
                },
                error: (error) => {
                    console.error('Error al eliminar:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Este ${this.categoryNames[this.selectedCategory].toLowerCase()} no puede eliminarse porque está siendo utilizado. Verifica su uso antes de intentar eliminarlo.`
                    });
                    this.displayConfirmDialog = false;
                    this.itemToDelete = null;
                }
            });
        } else {
            this.displayConfirmDialog = false;
            this.itemToDelete = null;
        }
    }


    refreshData(): void {
        this.displayDialog = false;
        this.tempName = '';
        this.loadData(this.selectedCategory);
    }

    confirmSaveItem(): void {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que deseas guardar los cambios?',
            header: 'Confirmar Guardado',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.saveItem();
            }
        });
    }

    confirmCancel(): void {
        this.confirmationService.confirm({
            message: '¿Estás seguro de que deseas cancelar? Los cambios no guardados se perderán.',
            header: 'Confirmar Cancelación',
            icon: 'pi pi-info-circle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.displayDialog = false;
                this.formSubmitted = false;
            }
        });
    }

}
