import { SettingService } from 'src/app/core/service/setting.service';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
    FormControl,
    Validators,
    ReactiveFormsModule,
    FormGroup,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { slots, ParkingData, NewParking } from 'src/app/core/api/parkings';
import { ParkingService } from 'src/app/core/service/parking.service';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import {
    CatalogBenefitType,
    CatalogSlotStatus,
    CatalogSlotType,
    CatalogVehicleType,
    StatusItem,
} from 'src/app/core/api/management-catalog/catalog';
import { Table } from 'primeng/table';

@Component({
    templateUrl: './create-parking.component.html',
    providers: [MessageService, ConfirmationService, ReactiveFormsModule],
    styleUrls: ['./create-parking-component.css'],
})
export class CreateParkingComponent implements OnInit {
    status_parking: SelectItem[] = [];
    selected_drop: SelectItem = { value: '' };
    status_slot: SelectItem[] = [];
    selected_status_slot: SelectItem = { value: '' };
    slot_type: SelectItem[] = [];
    selected_slot_type: SelectItem = { value: '' };
    vehicle_type: SelectItem[] = [];
    selected_vehicle_type: SelectItem = { value: '' };
    amount_type: SelectItem[] = [];
    selected_amount_type: SelectItem = { value: '' };
    parkingSlots: slots[] = [];
    parkingData: ParkingData[] = [];
    newParking: NewParking;
    isLimitDisabled = false;
    loading: boolean = false;
    totalSpaces: number;
    status_parkings: { nameStatus: string }[] = [];
    vehicleTypes: { nameVehicle: string }[] = [];
    benefitTypes: { nameBenefit: string; allowAmount?: boolean }[] = [];
    slotTypes: { nameSlot: string; allowParallelAssignments?: boolean }[] = [];
    stateSlot: { nameStateSlot: string }[] = [];
    filteredStateSlot: { nameStateSlot: string }[] = [];
    maxMontValue: number = 0;
    maxAssignmentValue: number = 0;
    slotsGenerateValue: number = 0;
    slotNumber: string;

    benefitTypeMap = {
        SIN_COSTO: 'SIN COSTO',
    };

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private parkingService: ParkingService,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private settingService: SettingService
    ) { }

    transformBenefitType(benefitType: string): string {
        return this.benefitTypeMap[benefitType] || benefitType;
    }
    getOriginalBenefitType(transformedType: string): string {
        return (
            Object.keys(this.benefitTypeMap).find(
                (key) => this.benefitTypeMap[key] === transformedType
            ) || transformedType
        );
    }

    ngOnInit(): void {
        this.onSlotTypeChanges();

        this.formularioSlots.get('slotType')?.valueChanges.subscribe((value) => {
            this.updateLimitOfAssignments(value);
        });

        this.formularioSlots.get('benefitType')?.valueChanges.subscribe((value) => {
            this.updateamount(value);
        });

        this.loadStatusOptions();
        this.loadVehicleOptions();
        this.loadBenefitOptions();
        this.loadSlotTypesOptions();
        this.loadStateSlotOptions();
        this.loadSettings();

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

    loadSettings(): void {
        this.settingService.getSetting().then((data) => {
            const settingsMap = new Map(data.map((s: any) => [s.settingKey, s.settingValue]));
            const maxMont = settingsMap.get('MAX_MONT');
            const maxAssignment = settingsMap.get('MAX_ASSIGNMENT');
            const slotsGenerate = settingsMap.get('SLOTS_GENERATE');

            if (maxMont && !isNaN(+maxMont)) {
                this.maxMontValue = +maxMont;
                const amountControl = this.formularioSlots.get('amount');
                if (amountControl) {
                    amountControl.setValidators([
                        Validators.required,
                        Validators.min(1),
                        Validators.max(this.maxMontValue),
                        Validators.pattern(this.amountPattern)
                    ]);
                    amountControl.updateValueAndValidity();
                }
            } else {
                console.warn('MAX_MONT no encontrado o inválido');
            }

            if (maxAssignment && !isNaN(+maxAssignment)) {
                this.maxAssignmentValue = +maxAssignment;
                const limitControl = this.formularioSlots.get('limitOfAssignments');
                if (limitControl) {
                    limitControl.setValidators([
                        Validators.required,
                        Validators.min(2),
                        Validators.max(this.maxAssignmentValue),
                        Validators.pattern("^[0-9]+$"),
                    ]);
                    limitControl.updateValueAndValidity();
                }
            }

            if (slotsGenerate && !isNaN(+slotsGenerate)) {
                this.slotsGenerateValue = +slotsGenerate;
                //console.log('SLOTS_GENERATE cargado:', this.slotsGenerateValue);

                const numEspaciosControl = this.formularioSlots.get('numEspacios');
                if (numEspaciosControl) {
                    numEspaciosControl.setValidators([
                        Validators.required,
                        Validators.min(1),
                        Validators.max(this.slotsGenerateValue),
                        Validators.pattern("^[0-9]+$"),
                    ]);
                    numEspaciosControl.updateValueAndValidity();
                }
            } else {
                console.warn('SLOTS_GENERATE no encontrado o inválido');
            }

        }).catch((error) => {
            console.error('Error al cargar configuraciones:', error);
        });
    }



    loadVehicleOptions(): void {
        this.parkingService.getVehicleTypeCatalog().subscribe({
            next: (response) => {
                this.vehicleTypes = response.data
                    .filter((item: CatalogVehicleType) => item.isActive)
                    .map((item: CatalogVehicleType) => ({
                        nameVehicle: item.name,
                    }));
            },
            error: (error) => {
                console.error('Error al obtener los vehículos:', error);
            },
        });
    }

    loadBenefitOptions(): void {
        this.parkingService.getBenefitTypeCatalog().subscribe({
            next: (response) => {
                this.benefitTypes = response.data
                    .filter((item: CatalogBenefitType) => item.isActive)
                    .map((item: CatalogBenefitType) => ({
                        nameBenefit: item.name,
                        displayName: this.transformBenefitType(item.name),
                        allowAmount: item.allowAmount,
                        amount: item.allowAmount ? null : 0,
                    }));
            },
            error: (error) => {
                console.error('Error al obtener el tipo de beneficio:', error);
            },
        });
    }

    loadSlotTypesOptions(): void {
        this.parkingService.getSlotTypeCatalog().subscribe({
            next: (response) => {
                this.slotTypes = response.data
                    .filter((item: CatalogSlotType) => item.isActive)
                    .map((item: CatalogSlotType) => ({
                        nameSlot: item.name,
                        allowParallelAssignments: item.allowParallelAssignments,
                    }));
            },
            error: (error) => {
                console.error('Error al obtener el tipo de estado:', error);
            },
        });
    }

    loadStateSlotOptions(): void {
        this.parkingService.getSlotStatusCatalog().subscribe({
            next: (response) => {
                this.stateSlot = response.data
                    .filter((item: CatalogSlotStatus) => item.isActive)
                    .map((item: CatalogSlotStatus) => ({
                        nameStateSlot: item.name,
                    }));

                this.filteredStateSlot = this.stateSlot.filter(
                    (item) => item.nameStateSlot !== 'OCUPADO'
                );
            },
            error: (error) => {
                console.error(
                    'Error al obtener el estado del espacio de parqueo:',
                    error
                );
            },
        });
    }

    ngAfterViewInit() {
        this.tableActualizar();

        this.onSlotTypeChanges();
        this.changeDetectorRef.detectChanges();
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    onSlotTypeChange(slot: any): void {
        if (!slot) return;
        const selectedSlotType = this.slotTypes.find(
            (st) => st.nameSlot === slot.slotType
        );
        slot.limitOfAssignments = selectedSlotType?.allowParallelAssignments
            ? 2
            : 1;
    }
    onSlotTypeChanges(): void {
        if (!this.SlotTypeSelected) return;
        const selectedSlotType = this.slotTypes.find(
            (st) => st.nameSlot === this.SlotTypeSelected
        );
        this.limitSchedules = selectedSlotType?.allowParallelAssignments ? 2 : 1;
        //console.log('Límite de asignaciones actualizado:', this.limitSchedules);
        this.changeDetectorRef.detectChanges();
    }

    displayedColumns: string[] = [
        'slotNumber',
        'slotType',
        'limitOfAssignments',
        'vehicleType',
        'benefitType',
        'amount',
        'status',
        'actions',
    ];

    dataSource: slots[] = [];

    redirect() {
        this.router.navigate(["/parking-crud"]);
    }

    redirect2() {
        this.router.navigate(['/pages/crud/viewparking']);
    }

    updateLimitOfAssignments(slotType: string): void {
        const limitOfAssignmentsControl =
            this.formularioSlots.get('limitOfAssignments');

        if (!slotType) {
            limitOfAssignmentsControl?.setValue(1, { emitEvent: false });
            limitOfAssignmentsControl?.disable();
            return;
        }

        const selectedType = this.slotTypes.find(
            (type) => type.nameSlot === slotType
        );

        if (selectedType) {
            if (!selectedType.allowParallelAssignments) {
                limitOfAssignmentsControl?.setValue(1, { emitEvent: false });
                limitOfAssignmentsControl?.disable();
            } else {
                limitOfAssignmentsControl?.setValue(2, { emitEvent: false });
                limitOfAssignmentsControl?.enable();
            }
        }
    }

    updateamount(benefitType: string) {
        const amountControl = this.formularioSlots.get('amount');
        if (!amountControl) return;

        const selectedBenefit = this.benefitTypes.find(
            (bt) => bt.nameBenefit === benefitType
        );

        if (selectedBenefit && !selectedBenefit.allowAmount) {
            amountControl.setValue(0, { emitEvent: false });
            amountControl.disable();
        } else {
            amountControl.enable();
            amountControl.setValidators([
                Validators.required,
                Validators.min(1),
                Validators.max(this.maxMontValue),
            ]);
            amountControl.updateValueAndValidity();
        }
    }

    // Define la expresión regular como un objeto RegExp
    amountPattern2: RegExp = /^\d{1,5}(\.\d{0,2})?$/;

    validateAmount(slot: any) {
        slot.amountError = null;

        if (!slot.allowAmount) {
            slot.amount = 0;
            return;
        }

        const amountNum = Number(slot.amount);

        if (isNaN(amountNum) || amountNum < 1) {
            slot.amountError = 'El monto debe ser mayor o igual a 1.';
            return;
        }

        if (amountNum > this.maxMontValue) {
            slot.amountError = `El monto no puede superar ${this.maxMontValue}.`;
            return;
        }

        if (!this.amountPattern2.test(slot.amount.toString())) {
            slot.amountError = 'Solo se permiten hasta 5 dígitos y 2 decimales.';
        }
    }


    onBenefitTypeChange(slot: any) {
        const selectedBenefit = this.benefitTypes.find(
            (bt) => bt.nameBenefit === slot.benefitType
        );

        slot.allowAmount = selectedBenefit?.allowAmount ?? false;

        if (!slot.allowAmount) {
            slot.amount = 0;
        } else {
            slot.amount = this.amountPattern2.test(slot.amount?.toString())
                ? slot.amount
                : null;
        }
    }

    addParkingSlots() {
        if (this.validateFormularioSlots()) {

            const numEspacios = this.formularioSlots.get('numEspacios')?.value;
            const rawPrefix = this.formularioSlots.get('slotNumber').value;
            const cleanPrefix = rawPrefix.endsWith('-') ? rawPrefix.slice(0, -1) : rawPrefix;

            // Obtener el último número usado para evitar repetir
            const existingNumbers = this.parkingSlots
                .map(slot => {
                    const parts = slot.slotNumber.split('-');
                    return Number(parts[parts.length - 1]) || 0;
                });
            const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;

            for (let i = 1; i <= numEspacios; i++) {
                const newSlotNumberId = maxNumber + i;

                const selectedBenefitType = this.formularioSlots.get('benefitType')?.value;
                const selectedBenefit = this.benefitTypes.find(
                    (bt) => bt.nameBenefit === selectedBenefitType
                );

                const newSlot = {
                    slotNumberId: newSlotNumberId,
                    slotNumber: `${cleanPrefix}-${newSlotNumberId}`,
                    slotType: this.formularioSlots.get('slotType').value,
                    limitOfAssignments: this.formularioSlots.get('limitOfAssignments').value,
                    vehicleType: this.formularioSlots.get('vehicleType').value,
                    benefitType: selectedBenefitType,
                    allowAmount: selectedBenefit?.allowAmount ?? false,
                    amount: selectedBenefit?.allowAmount
                        ? this.formularioSlots.get('amount').value
                        : 0,
                    status: this.formularioSlots.get('status').value,
                };

                this.parkingSlots.push(newSlot);
            }

            // Si usas PrimeNG, asegúrate de reasignar el array para que detecte el cambio
            this.dataSource = [...this.parkingSlots];

            this.totalSpaces = this.parkingSlots.length;
            this.onSlotTypeChanges();

            this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Espacios de estacionamiento agregados exitosamente.',
                life: 3000,
            });

            this.formularioSlots.reset();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'Por favor, corrige los errores del formulario antes de agregar espacios de estacionamiento.',
                life: 3000,
            });
        }
    }


    addParkingSlot() {
        // Encuentra el número más alto de slot en el array
        const lastSlotNumber =
            this.parkingSlots.length > 0
                ? Math.max(...this.parkingSlots.map((slot) => Number(slot.slotNumber)))
                : 0;
        const newSlotNumber = lastSlotNumber + 1;

        if (this.benefitTypeSelected === 'SIN COSTO') {
            this.benefitTypeSelected = 'SIN_COSTO';
        }
        // Añadir el nuevo slot con el número calculado
        this.parkingSlots.push({
            slotNumber: newSlotNumber.toString(),
            slotType: this.SlotTypeSelected,
            limitOfAssignments: this.limitSchedules,
            vehicleType: this.tipoVehiculoSelected,
            benefitType: this.benefitTypeSelected,
            amount: this.amountParking,
            status: this.stateSlotSelected,
        });

        this.parkingSlots = [...this.parkingSlots];
        this.updateTotalSpaces();
    }

    deleteParkingSlot(slotNumber: string): void {
        this.confirmationService.confirm({
            message: `¿Está seguro que desea eliminar el espacio ${slotNumber}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.parkingSlots = this.parkingSlots.filter(
                    slot => slot.slotNumber !== slotNumber
                );
                this.dataSource = [...this.parkingSlots];
                this.updateTotalSpaces();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Has eliminado el espacio de parqueo ${slotNumber}.`
                });
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelado',
                    detail: 'Has cancelado la acción.'
                });
            }
        });
    }



    // Función para actualizar el total de espacios
    updateTotalSpaces() {
        this.totalSpaces = this.parkingSlots.length;
    }


    phonePattern = /^[0-9\s*+\-(),]*$/;
    emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    get commentsLength() {
        return this.formularioParqueo.get('comments').value?.length || 0;
    }

    formularioParqueo = new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(75)]),
        address: new FormControl('', [
            Validators.required,
            Validators.maxLength(75),
        ]),
        numberOfIdentifier: new FormControl('', [Validators.maxLength(25)]),
        contactReference: new FormControl('', [Validators.maxLength(60)]),
        phone: new FormControl('', [
            Validators.maxLength(50),
            Validators.pattern(this.phonePattern),
        ]),
        email: new FormControl('', [
            Validators.required,
            Validators.pattern(this.emailPattern),
            Validators.maxLength(50),
        ]),
        comments: new FormControl('', [Validators.maxLength(255)]),
        status: new FormControl('', Validators.required),
    });

    amountPattern = '^\\d{1,5}(\\.\\d{0,2})?$';

    formularioSlots = new FormGroup({
        slotNumber: new FormControl('', [
            Validators.required,
            Validators.maxLength(25),
        ]),
        slotType: new FormControl('', [Validators.required]),
        limitOfAssignments: new FormControl(1, [
            Validators.required,
            Validators.min(1),
            Validators.max(this.maxAssignmentValue),
            Validators.pattern("^[0-9]+$"),
        ]),
        benefitType: new FormControl('', [Validators.required]),
        amount: new FormControl(0, [
            Validators.required,
            Validators.pattern(this.amountPattern),
        ]),
        vehicleType: new FormControl('', [Validators.required]),
        status: new FormControl('', [Validators.required]),
        numEspacios: new FormControl(null, [
            Validators.required,
            Validators.max(this.slotsGenerateValue),
            Validators.pattern("^[0-9]+$"),
        ]),
    });

    //Declaración de slots de parqueos
    SlotTypeSelected: string;
    selectedState: string;
    tipoVehiculoSelected: string;
    benefitTypeSelected: string;
    amountParking: number = 0;
    numEspacios: number;
    stateSlotSelected: string;
    limitSchedules: number = 2;

    tableActualizar() {
        this.parkingSlots = [...this.parkingSlots];
        this.totalSpaces = this.parkingSlots.length;
        this.onSlotTypeChanges();
    }

    CreateParking() {
        if (this.validateFormularioParqueo()) {
            const ParkingData: ParkingData = {
                name: this.formularioParqueo.get('name')?.value,
                numberOfIdentifier:
                    this.formularioParqueo.get('numberOfIdentifier').value,
                address: this.formularioParqueo.get('address')?.value,
                contactReference: this.formularioParqueo.get('contactReference').value,
                phone: this.formularioParqueo.get('phone').value,
                email: this.formularioParqueo.get('email')?.value,
                comments: this.formularioParqueo.get('comments').value,
                status: this.formularioParqueo.get('status')?.value,
                slots: this.parkingSlots.map((slot) => ({
                    ...slot,
                    benefitType: this.getOriginalBenefitType(slot.benefitType),
                })),
            };

            ///this.loading = true; // Mostrar el popup de carga

            //console.log("Datos que se enviarán al backend:", ParkingData);

            this.parkingService.sendParkingData(ParkingData).subscribe(
                (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Parqueo creado exitosamente.',
                        life: 1000,
                    });

                    setTimeout(() => {
                        this.router.navigate(["/parking-crud"]).then(() => {
                        });
                    }, 1500);
                },
                (error) => {
                    // this.loading = false;

                    let errorMessage = 'Ocurrió un error al crear el parqueo.';
                    if (error.status === 400) {
                        errorMessage = 'Solicitud incorrecta. Verifica tu formulario.';
                    } else if (error.status === 500) {
                        errorMessage =
                            'Error del servidor. Por favor, intenta nuevamente más tarde.';
                    }

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: errorMessage,
                        life: 3000,
                    });
                }
            );
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                    'Por favor, corrige los errores del formulario antes de continuar.',
                life: 3000,
            });
        }
    }

    validateFormularioParqueo() {
        const errors = [];
        if (!this.formularioParqueo.get('name')?.value) {
            errors.push('El nombre es obligatorio.');
        }

        if (!this.formularioParqueo.get('address')?.value) {
            errors.push('La dirección es obligatoria.');
        }
        if (!this.formularioParqueo.get('email')?.value) {
            errors.push('El correo electrónico es obligatorio.');
        }
        if (!this.formularioParqueo.get('status')?.value) {
            errors.push('El estado es obligatorio.');
        }

        if (errors.length > 0) {
            errors.forEach((error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error de Validación',
                    detail: error,
                    life: 3000,
                });
            });
            return false;
        }
        return true;
    }

    validateFormularioSlots() {
        this.messageService.clear();

        if (this.formularioSlots.valid) {
            return true;
        } else {
            // El formulario no es válido, marcar los campos con errores
            this.formularioSlots.markAllAsTouched();

            for (const control in this.formularioSlots.controls) {
                if (this.formularioSlots.controls.hasOwnProperty(control)) {
                    const formControl = this.formularioSlots.get(control);

                    if (formControl?.invalid) {
                        let errorMsg = '';

                        if (formControl.errors?.['required']) {
                            errorMsg = `${control} es obligatorio.`;
                        }
                        if (formControl.errors?.['pattern']) {
                            errorMsg = `${control} no tiene un formato válido.`;
                        }
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error de validación',
                            detail: errorMsg,
                        });
                    }
                }
            }

            return false;
        }
    }

    deleteParkingSlotTable(slotNumber: string) {
        // Usamos un bucle para recorrer los elementos de parkingSlots
        for (let i = 0; i < this.parkingSlots.length; i++) {
            if (this.parkingSlots[i].slotNumber === slotNumber) {
                // Elimina el elemento en el índice actual
                this.parkingSlots.splice(i, 1);
                // Salimos del bucle ya que hemos encontrado y eliminado el elemento
                break;
            }
        }
    }

    confirm(event: Event) {
        this.confirmationService.confirm({
            key: 'confirm',
            target: event.target || new EventTarget(),
            message: '¿Estas seguro de que quieres crear los espacios de parqueo?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.addParkingSlots();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Has Cancelado la acción',
                });
            },
        });
    }

    confirm2() {
        this.confirmationService.confirm({
            key: 'confirm2',
            message: '¿Estas seguro de crear el parqueo?',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.tableActualizar();
                this.CreateParking();
            },
            reject: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Has Cancelado la acción',
                });
            },
        });
    }

    confirm3() {
        this.confirmationService.confirm({
            key: 'confirm2',
            message: '¿Estas seguro que quieres Salir?',
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
                    detail: 'Has Cancelado la acción',
                });
            },
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

        table.filter('', 'anyField', 'custom');

        table.filterGlobal(inputValue, 'contains');
    }
}
