import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, SelectItem } from 'primeng/api';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { slots, ParkingData, Parking } from 'src/app/core/api/parkings';
import { ParkingService } from 'src/app/core/service/parking.service';

import {
    CatalogBenefitType,
    CatalogSlotStatus,
    CatalogSlotType,
    CatalogVehicleType,
    StatusItem,
} from 'src/app/core/api/management-catalog/catalog';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-view-parking',
    templateUrl: './view-parking.component.html',
    providers: [ConfirmationService, MessageService],
    styleUrls: ['./view-parking.css'],
})
export class ViewParkingComponent implements OnInit {

    formularioParqueo!: FormGroup;
    formularioSlots!: FormGroup;

    id!: string | null;
    parkingSlots: slots[] = [];
    originalData!: ParkingData;
    readOnly = true;

    status_parkings: { nameStatus: string }[] = [];
    vehicleTypes: { nameVehicle: string }[] = [];
    benefitTypes: { nameBenefit: string }[] = [];
    slotTypes: { nameSlot: string }[] = [];
    stateSlot: { nameStateSlot: string }[] = [];
    filteredStateSlot: { nameStateSlot: string }[] = [];

    loading = false;

    totalSpaces = 0;

    // Filter text for global filter in p-table
    globalFilter: string = '';

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private parkingService: ParkingService,
        private router: Router,
        private fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.id = this.parkingService.getParkingId() || localStorage.getItem('parkingId');

        if (!this.id) {
            console.error('El ID es inválido o no se encontró.');
            return;
        }
        localStorage.setItem('parkingId', this.id);

        this.initForm();
        this.loadStatusOptions();
        this.loadVehicleOptions();
        this.loadBenefitOptions();
        this.loadSlotTypesOptions();
        this.loadStateSlotOptions();

        this.getParkingData(this.id);
        this.loadSlots();

        const savedData = localStorage.getItem('parkingData');
        if (savedData) {
            const parkingData = JSON.parse(savedData);
            this.originalData = parkingData;

            this.formularioParqueo.patchValue({
                name: parkingData.name,
                address: parkingData.address,
                numberOfIdentifier: parkingData.numberOfIdentifier,
                contactReference: parkingData.contactReference,
                phone: parkingData.phone,
                email: parkingData.email,
                comments: parkingData.comments,
                status: parkingData.status,
            });

            if (parkingData.slots?.length) {
                this.parkingSlots = parkingData.slots;
            }
        }
    }

    initForm() {
        this.formularioParqueo = this.fb.group({
            name: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(75)]],
            address: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(75)]],
            numberOfIdentifier: [{ value: '', disabled: true }, [Validators.maxLength(25)]],
            contactReference: [{ value: '', disabled: true }, [Validators.maxLength(60)]],
            phone: [{ value: '', disabled: true }, [Validators.maxLength(50), Validators.pattern(/^[0-9\s*+\-(),]*$/)]],
            email: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/), Validators.maxLength(50)]],
            comments: [{ value: '', disabled: true }, [Validators.maxLength(255)]],
            status: [{ value: '', disabled: true }, Validators.required],
        });

        this.formularioSlots = this.fb.group({
            slotNumber: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(25)]],
            slotType: [{ value: '', disabled: true }, [Validators.required]],
            limitOfAssignments: [{ value: 1, disabled: true }, [Validators.required, Validators.pattern(/^(?:[1-9]|[1-9][0-9]|100)$/)]],
            benefitType: [{ value: '', disabled: true }, [Validators.required]],
            amount: [{ value: 0, disabled: true }, [Validators.required, Validators.pattern(/^\d{1,3}(\.\d{0,2})?$/)]],
            vehicleType: [{ value: '', disabled: true }, [Validators.required]],
            status: [{ value: '', disabled: true }, [Validators.required]],
            numEspacios: [{ value: null, disabled: true }, [Validators.required, Validators.max(100)]],
        });
    }

    loadStatusOptions() {
        this.parkingService.getStatusCatalog().subscribe({
            next: (response) => {
                this.status_parkings = response.data
                    .filter((item: StatusItem) => item.isActive)
                    .map((item: StatusItem) => ({ nameStatus: item.name }));
            },
            error: (error) => {
                console.error('Error al obtener estados:', error);
            },
        });
    }

    loadVehicleOptions() {
        this.parkingService.getVehicleTypeCatalog().subscribe({
            next: (response) => {
                this.vehicleTypes = response.data
                    .filter((item: CatalogVehicleType) => item.isActive)
                    .map((item: CatalogVehicleType) => ({ nameVehicle: item.name }));
            },
            error: (error) => {
                console.error('Error al obtener los vehículos:', error);
            },
        });
    }

    loadBenefitOptions() {
        this.parkingService.getBenefitTypeCatalog().subscribe({
            next: (response) => {
                this.benefitTypes = response.data
                    .filter((item: CatalogBenefitType) => item.isActive)
                    .map((item: CatalogBenefitType) => ({ nameBenefit: item.name }));
            },
            error: (error) => {
                console.error('Error al obtener el tipo de beneficio:', error);
            },
        });
    }

    loadSlotTypesOptions() {
        this.parkingService.getSlotTypeCatalog().subscribe({
            next: (response) => {
                this.slotTypes = response.data
                    .filter((item: CatalogSlotType) => item.isActive)
                    .map((item: CatalogSlotType) => ({ nameSlot: item.name }));
            },
            error: (error) => {
                console.error('Error al obtener el tipo de estado:', error);
            },
        });
    }

    loadStateSlotOptions() {
        this.parkingService.getSlotStatusCatalog().subscribe({
            next: (response) => {
                this.stateSlot = response.data
                    .filter((item: CatalogSlotStatus) => item.isActive)
                    .map((item: CatalogSlotStatus) => ({ nameStateSlot: item.name }));

                this.filteredStateSlot = this.stateSlot.filter(item => item.nameStateSlot !== 'OCUPADO');
            },
            error: (error) => {
                console.error('Error al obtener el estado del espacio de parqueo:', error);
            },
        });
    }

    loadSlots() {
        if (!this.id) {
            console.error('El ID del parking no está definido o es inválido.');
            return;
        }

        this.parkingService.getLocation(this.id).subscribe(
            (response: any) => {
                if (response && response.data && response.data.slots) {
                    this.parkingSlots = response.data.slots;
                    this.sortParkingSlots();
                    this.totalSpaces = this.parkingSlots.length;
                } else {
                    console.error('La respuesta no tiene la propiedad "slots".');
                }
            },
            (error) => {
                console.error('Error al obtener los slots de parqueo:', error);
            }
        );
    }

    getParkingData(id: string) {
        this.parkingService.getLocation(id).subscribe(
            (response) => {
                const parkingData = response.data;
                this.originalData = parkingData;
                localStorage.setItem('parkingData', JSON.stringify(parkingData));

                this.formularioParqueo.patchValue({
                    name: parkingData.name,
                    address: parkingData.address,
                    numberOfIdentifier: parkingData.numberOfIdentifier,
                    contactReference: parkingData.contactReference,
                    phone: parkingData.phone,
                    email: parkingData.email,
                    comments: parkingData.comments,
                    status: parkingData.status,
                });

                if (parkingData.slots?.length) {
                    this.parkingSlots = parkingData.slots;
                    this.sortParkingSlots();
                    this.totalSpaces = this.parkingSlots.length;
                }
            },
            (error) => {
                console.error(error);
            }
        );
    }

    sortParkingSlots() {
        this.parkingSlots.sort((a, b) => {
            const numA = Number(a.slotNumber.replace(/\D/g, '')) || 0;
            const numB = Number(b.slotNumber.replace(/\D/g, '')) || 0;
            return numA - numB;
        });
    }

    applyGlobalFilter(event: any) {
        this.globalFilter = event.target.value;
    }

    deleteParkingSlotTable(slotNumber: string) {
        this.parkingSlots = this.parkingSlots.filter(slot => slot.slotNumber !== slotNumber);
        this.totalSpaces = this.parkingSlots.length;
    }

    redirect() {
        this.router.navigate(['/parking-crud']);
    }

    get commentsLength() {
        return this.formularioParqueo.get('comments')?.value?.length || 0;
    }

    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

        table.filter('', 'anyField', 'custom');

        table.filterGlobal(inputValue, 'contains');
    }


}
