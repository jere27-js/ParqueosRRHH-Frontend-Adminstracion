import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    ChangeDetectorRef,
} from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
    FormControl,
    Validators,
    FormArray,
    FormsModule,
    ReactiveFormsModule,
    FormGroup,
    FormBuilder,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { slots, ParkingData, NewParking } from 'src/app/core/api/parkings';
import { ParkingService } from 'src/app/core/service/parking.service';
import { Router } from '@angular/router';
import { Parking } from 'src/app/core/api/parkings';
import { SelectItem } from 'primeng/api';
import { MatSort } from '@angular/material/sort';
import { SettingService } from 'src/app/core/service/setting.service';

import {
    CatalogBenefitType,
    CatalogSlotStatus,
    CatalogSlotType,
    CatalogVehicleType,
    StatusItem,
} from 'src/app/core/api/management-catalog/catalog';
import { Table } from 'primeng/table';

@Component({
    templateUrl: './emptydemo.component.html',
    providers: [ConfirmationService, MessageService],
    styleUrls: ['./emptydemo-component.css'],
})
export class EmptyDemoComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;

    formularioParqueo: FormGroup;
    formularioSlots: FormGroup;
    id: string;
    parkings: Parking[] = [];
    parking: Parking = {};
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
    originalData: ParkingData;
    loading: boolean = false;
    slotIdentificate: string;
    slotNumber: string;
    isLimitDisabled = false;
    maxMontValue: number = 0;
    maxAssignmentValue: number = 0;
    slotsGenerateValue: number = 0;
    lastMaxSlotNumberUsed = 0;

    status_parkings: { nameStatus: string }[] = [];
    vehicleTypes: { nameVehicle: string }[] = [];
    stateSlot: { nameStateSlot: string }[] = [];
    filteredStateSlot: { nameStateSlot: string }[] = [];
    benefitTypes: { nameBenefit: string; allowAmount?: boolean }[] = [];
    slotTypes: { nameSlot: string; allowParallelAssignments?: boolean }[] = [];

    benefitTypeMap = {
        SIN_COSTO: 'SIN COSTO',
    };
    nameBenefit: any;

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
        this.dataSource.sort = this.sort;
        this.id = this.parkingService.getParkingId();

        if (!this.id) {
            this.id = localStorage.getItem('parkingId');
        }

        if (!this.id) {
            console.error('El ID es inválido o no se encontró.');
            return;
        }

        //console.log("ID válido:", this.id);

        if (!localStorage.getItem('parkingId')) {
            localStorage.setItem('parkingId', this.id);
        }

        this.initForm();
        this.getParkingData(this.id);
        this.loadSlots();

        const savedData = localStorage.getItem('parkingData');
        if (savedData) {
            const parkingData = JSON.parse(savedData);
            this.originalData = parkingData; // Restaurar los datos originales

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

            if (parkingData.slots && parkingData.slots.length > 0) {
                this.parkingSlots = parkingData.slots; // Restaurar los slots originales
                const slot = parkingData.slots[0];
                this.formularioSlots.patchValue({
                    slotNumber: '',
                    slotType: '',
                    limitOfAssignments: '',
                    benefitType: '',
                    amount: '',
                    vehicleType: '',
                    status: '',
                });
            }
        } else {
            // Si no hay datos guardados, llama a la función para obtener los datos
            this.getParkingData(this.id);
        }

        this.dataSource.paginator = this.paginator;
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

    loadSettings(): void {
        this.settingService
            .getSetting()
            .then((data) => {
                const settingsMap = new Map(
                    data.map((s: any) => [s.settingKey, s.settingValue])
                );
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
                            Validators.pattern(this.amountPattern),
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
                            Validators.pattern('^[0-9]+$'),
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
                            Validators.pattern('^[0-9]+$'),
                        ]);
                        numEspaciosControl.updateValueAndValidity();
                    }
                } else {
                    console.warn('SLOTS_GENERATE no encontrado o inválido');
                }
            })
            .catch((error) => {
                console.error('Error al cargar configuraciones:', error);
            });
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

    applyAllowAmountToSlots() {
        this.parkingSlots = this.parkingSlots.map((slot) => {
            const benefit = this.benefitTypes.find(
                (bt) => bt.nameBenefit === slot.benefitType
            );

            // Si no se encuentra, asumimos true si hay un monto mayor a 0
            const inferredAllow = benefit?.allowAmount ?? slot.amount > 0;
            return { ...slot, allowAmount: inferredAllow };
        });
    }

    loadBenefitOptions(): void {
        this.parkingService.getBenefitTypeCatalog().subscribe({
            next: (response) => {
                //console.log("Datos recibidos del servicio de beneficios:", response.data);
                this.benefitTypes = response.data
                    .filter((item: CatalogBenefitType) => item.isActive)
                    .map((item: CatalogBenefitType) => ({
                        nameBenefit: item.name,
                        displayName: this.transformBenefitType(item.name),
                        allowAmount: item.allowAmount,
                        amount: item.allowAmount ? null : 0,
                    }));

                if (this.parkingSlots && this.parkingSlots.length > 0) {
                    this.applyAllowAmountToSlots();
                }

                // console.log("Opciones de beneficio cargadas:", this.benefitTypes);
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
        this.dataSource.paginator = this.paginator;
        this.tableUpdate();
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
    dataSource = new MatTableDataSource<slots>(this.parkingSlots);

    loadSlots() {
        this.parkingService.getLocation(this.id).subscribe((Response: any) => {
            this.parkingSlots = Response.data.slots;

            if (this.benefitTypes && this.benefitTypes.length > 0) {
                this.applyAllowAmountToSlots();
            }
            this.sortParkingSlots();
            this.dataSource.data = [...this.parkingSlots];
            this.totalSpaces = this.parkingSlots.length;

            // Actualiza el último número máximo usado
            const existingNumbers = this.parkingSlots.map(slot => {
                const parts = slot.slotNumber.split('-');
                return Number(parts[parts.length - 1]) || 0;
            });
            this.lastMaxSlotNumberUsed = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
        });
    }


    phonePattern = /^[0-9\s*+\-(),]*$/;
    numberOfIdentifierPattern = /^[0-9]{1,8}$/;
    amountPattern = '^\\d{1,5}(\\.\\d{0,2})?$';
    emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    initForm() {
        this.formularioParqueo = this.fb.group({
            name: new FormControl('', [
                Validators.required,
                Validators.maxLength(75),
            ]),
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

        this.formularioSlots = this.fb.group({
            slotNumber: new FormControl('', [
                Validators.required,
                Validators.maxLength(25),
            ]),
            slotType: new FormControl('', [Validators.required]),
            limitOfAssignments: new FormControl(1, [
                Validators.required,
                Validators.min(1),
                Validators.max(this.maxAssignmentValue),
                Validators.pattern('^[0-9]+$'),
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
                Validators.pattern('^[0-9]+$'),
            ]),
        });
    }

    //Mantener número de slot previos
    getNextSlotNumber(): string {
        if (!this.parkingSlots || this.parkingSlots.length === 0) {
            return '';
        }

        const lastSlot = this.parkingSlots[this.parkingSlots.length - 1];
        const slotNumber = lastSlot.slotNumber || '';

        const match = slotNumber.match(/^([^\d]*)(\d+)$/);
        return match ? (match[1] || '') : '';
    }


    sortParkingSlots() {
        this.parkingSlots.sort((a, b) => {
            const numA = Number(a.slotNumber.replace(/\D/g, ''));
            const numB = Number(b.slotNumber.replace(/\D/g, ''));
            return numA - numB;
        });
    }

    getParkingData(id: string) {
        this.parkingService.getLocation(id).subscribe(
            (response) => {
                const parkingData = response.data;
                // console.log('Datos recibidos del backend:', parkingData);
                this.originalData = parkingData;

                // Guardar datos en localStorage
                localStorage.setItem('parkingData', JSON.stringify(parkingData));
                localStorage.setItem('parkingId', id);

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

                if (parkingData.slots && parkingData.slots.length > 0) {
                    this.parkingSlots = parkingData.slots;

                    this.sortParkingSlots();
                    this.dataSource.data = [...this.parkingSlots];

                    //console.log('Slots ordenados:', this.parkingSlots);
                    const nextSlot = this.getNextSlotNumber();
                    this.formularioSlots.patchValue({
                        slotNumber: nextSlot,
                        slotType: '',
                        limitOfAssignments: '',
                        benefitType: '',
                        amount: '',
                        vehicleType: '',
                        status: '',
                    });
                }
            },
            (error) => {
                console.error(error);
            }
        );
    }

    updateParking(id: string, originalData: ParkingData) {
        id = localStorage.getItem('parkingId');
        if (!id) {
            console.error('No se encontró el id del parqueo en el localStorage');
            return;
        }

        if (this.validateFormularioParqueo()) {
            const updatedData: Partial<ParkingData> = {};
            const formData = {
                name: this.formularioParqueo.get('name')?.value,
                numberOfIdentifier:
                    this.formularioParqueo.get('numberOfIdentifier')?.value,
                address: this.formularioParqueo.get('address')?.value,
                contactReference: this.formularioParqueo.get('contactReference')?.value,
                phone: this.formularioParqueo.get('phone')?.value,
                email: this.formularioParqueo.get('email')?.value,
                comments: this.formularioParqueo.get('comments')?.value,
                status: this.formularioParqueo.get('status')?.value,
                slots: this.parkingSlots.map((slot) => ({
                    ...slot,
                    benefitType: this.getOriginalBenefitType(slot.benefitType),
                })),
            };

            // Verificar si hay slots ocupados
            const hasOccupiedSlots = formData.slots.some(
                (slot) => slot.status === 'OCUPADO'
            );

            // Si hay slots ocupados, no permitir cambiar el estado del formulario
            if (hasOccupiedSlots && formData.status !== this.originalData.status) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                        'No se puede cambiar el estado del Parqueo porque hay slots ocupados.',
                    life: 3000,
                });
                return;
            }

            // Asignar todos los datos del formulario al objeto updatedData (sin incluir slots)
            for (const key in formData) {
                if (key !== 'slots') {
                    updatedData[key] = formData[key];
                }
            }

            // Verificar cambios en los slots, enviando solo los modificados
            const updatedSlots = formData.slots.filter((slot, index) => {
                return (
                    JSON.stringify(slot) !==
                    JSON.stringify(this.originalData.slots[index])
                );
            });

            // Identificar slots eliminados
            const deletedSlots = this.originalData.slots.filter((slot) => {
                return !formData.slots.some(
                    (currentSlot) => currentSlot.id === slot.id
                );
            });

            // Incluir arrays vacíos si no hay cambios en slots
            updatedData.slots = updatedSlots.length > 0 ? updatedSlots : [];
            updatedData.slotsToDelete =
                deletedSlots.length > 0 ? deletedSlots.map((slot) => slot.id) : [];

            // Enviar datos si hay algo que actualizar
            if (Object.keys(updatedData).length > 0) {
                //  console.log('Datos que se enviarán:', updatedData);
                this.parkingService.updateLocation(id, updatedData).subscribe(
                    (response) => {
                        //console.log('Respuesta del servidor:', response);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Parqueo actualizado exitosamente',
                            life: 1000,
                        });
                        setTimeout(() => {
                            this.router.navigate(['/parking-crud']).then(() => {
                                //this.loading = false; // Oculta el popup de carga.
                            });
                        }, 1300);
                    },
                    (error) => {
                        //this.loading = false;
                        let errorMessage = 'Ocurrió un error al actualizar el parqueo.';
                        if (error.status === 400) {
                            errorMessage =
                                'Solicitud incorrecta. Verifique los datos de los formularios';
                        } else if (error.status === 500) {
                            errorMessage =
                                'Error del servidor. Por favor, intenta nuevamente más tarde.';
                        } else {
                            errorMessage = `Error inesperado: ${error.message}`;
                        }
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: errorMessage,
                            life: 3000,
                        });
                    }
                );
            }
        }
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

    //Agregar la variable de los labels para arreglar la función
    addParkingSlots() {
        if (this.validateFormularioSlots()) {
            const currentSlotNumber = this.formularioSlots.get('slotNumber')?.value;
            const numEspacios = this.formularioSlots.get('numEspacios')?.value;
            const rawPrefix = this.formularioSlots.get('slotNumber').value;
            const cleanPrefix = rawPrefix.endsWith('-') ? rawPrefix.slice(0, -1) : rawPrefix;

            // iniciar el conteo y luego actualiza
            let startNumber = this.lastMaxSlotNumberUsed;

            for (let i = 0; i < numEspacios; i++) {
                const newSlotNumberId = startNumber + i + 1;

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

            // Actualiza el máximo histórico con los nuevos números agregados
            this.lastMaxSlotNumberUsed = startNumber + numEspacios;

            this.sortParkingSlots();
            this.dataSource.data = [...this.parkingSlots];
            this.totalSpaces = this.parkingSlots.length;
            this.onSlotTypeChanges();

            this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Espacios de estacionamiento agregados exitosamente.',
                life: 3000,
            });

            this.formularioSlots.reset({
                slotNumber: currentSlotNumber,
                slotType: '',
                limitOfAssignments: '',
                benefitType: '',
                amount: '',
                vehicleType: '',
                status: '',
                numEspacios: null,
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail:
                    'Por favor, corrige los errores del formulario antes de agregar espacios de estacionamiento.',
                life: 3000,
            });
        }
    }


    addParkingSlot() {
        const newSlotNumber = this.parkingSlots.length + 1;

        if (this.benefitTypeSelected === 'SIN COSTO') {
            this.benefitTypeSelected = 'SIN_COSTO';
        }
        this.parkingSlots.push({
            //slotNumber: newSlotNumber,
            slotNumber: newSlotNumber.toString(),
            slotType: this.SlotTypeSelected,
            limitOfAssignments: this.limitSchedules,
            vehicleType: this.tipoVehiculoSelected,
            benefitType: this.benefitTypeSelected,
            amount: this.amountParking,
            status: this.stateSlotSelected,
        });
        this.sortParkingSlots();
        this.dataSource.data = this.parkingSlots;
        this.totalSpaces = this.parkingSlots.length;
    }

    deleteParkingSlot(slotNumber: string) {
        this.confirmationService.confirm({
            message: `¿Está seguro que desea eliminar el espacio ${slotNumber}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.parkingSlots = this.parkingSlots.filter(
                    slot => slot.slotNumber !== slotNumber
                );
                this.dataSource.data = this.parkingSlots;
                this.totalSpaces = this.parkingSlots.length;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Has eliminado el espacio de parqueo ${slotNumber}.`,
                });
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


    totalSpaces = this.parkingSlots.length;

    constructor(
        private confirmationService: ConfirmationService,
        private settingService: SettingService,
        private messageService: MessageService,
        private parkingService: ParkingService,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private fb: FormBuilder
    ) { }

    //Declaración de parqueos
    nameForm: string;
    addressForm: string;
    nVoluntariaForm: number;
    referenceForm: string;
    phoneForm: string;
    emailForm: string;
    stateForm: string;
    commentsForm: string;

    //Declaración de slots de parqueos
    SlotTypeSelected: string;
    slotNumbers: string;
    selectedState: string;
    tipoParqueoSelected: string;
    tipoVehiculoSelected: string;
    benefitTypeSelected: string;
    stateParkingSelected: string;
    amountParking: number = 0;
    numEspacios: number;
    espaciosTrabajo: string;
    stateSlotSelected: string;
    limitSchedules: number = 2;

    //Clase para poder validar la parte de que se habilite el botón de generar slots
    validateFormularioParqueo() {
        if (this.formularioParqueo.valid) {
            return true;
        } else {
            this.formularioParqueo.markAllAsTouched();
            for (const control in this.formularioParqueo.controls) {
                if (this.formularioParqueo.controls.hasOwnProperty(control)) {
                    const formControl = this.formularioParqueo.get(control);

                    if (formControl?.invalid) {
                        let errorMsg = '';

                        if (formControl.errors?.['required']) {
                            errorMsg = `${control} es obligatorio.`;
                        }
                        if (formControl.errors?.['pattern']) {
                            errorMsg = `${control} no tiene un formato válido.`;
                        }
                        if (formControl.errors?.['email']) {
                            errorMsg = `${control} no es un correo válido.`;
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

    validateFormularioSlots() {
        // Limpia los mensajes anteriores
        this.messageService.clear();

        if (this.formularioSlots.valid) {
            return true;
        } else {
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

    tableUpdate() {
        this.sortParkingSlots();
        this.dataSource.data = this.parkingSlots;
        this.totalSpaces = this.parkingSlots.length;
        this.onSlotTypeChanges();
    }

    redirect() {
        this.router.navigate(['/parking-crud']);
    }

    get commentsLength() {
        return this.formularioParqueo.get('comments').value?.length || 0;
    }

    deleteParkingSlotTable(slotNumber: string) {
        // Usamos un bucle para recorrer los elementos de parkingSlots
        for (let i = 0; i < this.parkingSlots.length; i++) {
            if (this.parkingSlots[i].slotNumber === slotNumber) {
                // Elimina el elemento en el índice actual
                this.parkingSlots.splice(i, 1);
                break;
            }
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

        table.filter('', 'anyField', 'custom');

        table.filterGlobal(inputValue, 'contains');
    }

    confirm(event: Event) {
        this.confirmationService.confirm({
            key: 'confirm',
            target: event.target || new EventTarget(),
            message: '¿Estas segur@ de que quieres crear los espacios de parqueo?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
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
            message: '¿Estas segur@ de actualizar el parqueo?',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.tableUpdate();
                this.updateParking(this.id, this.originalData);
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
            message: '¿Estas seguro que quieres salir?',
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
}
