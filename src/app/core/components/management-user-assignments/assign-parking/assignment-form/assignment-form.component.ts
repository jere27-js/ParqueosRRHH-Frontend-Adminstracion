import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AssignmentsService } from 'src/app/core/service/assigned/assignments.service';
import { Assignments, GetEmployee, Tag } from 'src/app/core/api/assignment/assignment.model';
import { ConfirmationService, MessageService, Message } from 'primeng/api';
import { GetAllLocationsService } from 'src/app/core/service/assigned/get-all-locations.service';
import { Router } from '@angular/router';
import { AllLocations } from 'src/app/core/api/all-locatiions/location.model';
import { CatalogVehicleType } from 'src/app/core/api/management-catalog/catalog';
import { CatalogService } from 'src/app/core/service/management-catalog/catalog.service';

@Component({
  selector: 'app-assignment-form',
  standalone: false,
  templateUrl: './assignment-form.component.html',
  styleUrl: './assignment-form.component.scss'
})
export class AssignmentFormComponent implements OnInit {
    tagsFromApi: Tag[] = [];

    availableTags: { label: string, value: string }[] = []; // Lista de tags disponibles con nombres e IDs
    availableSlotId: string;

    locationsFromApi: AllLocations[] =[];
    selectedLocation: AllLocations | undefined;
    availableLocations: AllLocations[] =[];

    slotsForm: FormGroup;
    slots: any[] = [];
    slotIdFromCard: string;
    totalRecords: number;
    currentPage: number = 0;
    rows: number = 12;

    //vehicleTypes: string[] = ['CARRO', 'CAMION', 'MOTO'];
    vehicleTypes: string[] = [];
    vehicleCatalog: CatalogVehicleType[];

    year: number;

    errorMessageSearch: string;
    errorMessageAssignment: string;
    errorFromApi: string;

    assignmentForm: FormGroup;


    employeeForm: FormGroup;

    employeeData: GetEmployee;
    validateEmail: boolean = false;

    //busquedas:
    filteredSlots: any[] = []; // Slots filtrados
    selectedSlotType: string | null = null;
    searchText: string = '';
    slotTypes: string[] = []; // Para almacenar los tipos únicos de slots
    


    constructor(private fb: FormBuilder, private assignmentService: AssignmentsService, private getAllLocationsService: GetAllLocationsService,
                 private confirmationService: ConfirmationService, private messageService: MessageService,
                 private employeeService: AssignmentsService,
                 private router: Router,
                 private catalogService: CatalogService
                )
    {
      this.assignmentForm = this.fb.group({
        slotId: ['', [Validators.required, Validators.pattern('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')]],
        parkingCardNumber: [''],
        employee: this.fb.group({
          //id: [''],
          employeeCode: [''],
          name: ['',[Validators.required]],
          workplace: [''],
          identifierDocument: [''],
          company: [''],
          department: [''],
          subManagement: [''],
          management1: [''],
          management2: [''],
          workSite: [''],
          address: [''],
          email: ['',[Validators.required]],
          phone: [''],
          bossCode: [''],
          bossName: [''],
          bossWorkplace: [''],
          bossManagement: [''],
          bossEmail: [''],
          bossPhone: [''],
          vehicles: this.fb.array([]),
          vehiclesForDelete: this.fb.array([]),
        }),
        tags: this.fb.array([], Validators.required)
      });


      this.slotsForm = this.fb.group({
        locationId: [''],
        vehicleType: ['']
      });

    //Form para búsqueda
    this.employeeForm = this.fb.group({
        id: ['', [Validators.required, Validators.maxLength(8), Validators.pattern('^\\d+$')]]
      });
    }



ngOnInit(): void {
    this.year = new Date().getFullYear();
    this.addVehicle();

    //Multi Select obtiene tags de la api Get all tag
    this.assignmentService.getAllTags(58, 1).subscribe((response) => {
        this.tagsFromApi = response.data;

      // Filtrar solo las etiquetas con status ACTIVO
        const activeTags = this.tagsFromApi.filter(tag => tag.status === 'ACTIVO');

        this.availableTags = activeTags.map(tag => ({ label: tag.name, value: tag.id }));

      });

    //DropDown all locations
    this.getAllLocationsService.getAllLocations(58, 1).subscribe((response) => {
    this.locationsFromApi = response.data;

    const activeLocations = this.locationsFromApi.filter(location => location.status === 'ACTIVO')

    this.availableLocations = activeLocations;

    this.getAllVehicles()

  });


}

initializeFilters(): void {
  // Obtener tipos únicos de slots
  this.slotTypes = [...new Set(this.filteredSlots.map(slot => slot.slotType))];
 
  this.filteredSlots = [...this.slots];
  this.totalRecords = this.filteredSlots.length;
}

filterSlotsByType(): void {
  if (!this.selectedSlotType) {
    this.filteredSlots = [...this.slots];
  } else {
    this.filteredSlots = this.slots.filter(slot => 
      slot.slotType === this.selectedSlotType
    );
  }
  this.filterSlots(); // Aplicar también el filtro de texto si existe
}

filterSlots(): void {
  if (!this.searchText) {
    if (!this.selectedSlotType) {
      this.filteredSlots = [...this.slots];
    } else {
      this.filteredSlots = this.slots.filter(slot => 
        slot.slotType === this.selectedSlotType
      );
    }
  } else {
    const searchLower = this.searchText.toLowerCase();
    this.filteredSlots = this.slots.filter(slot => 
      (!this.selectedSlotType || slot.slotType === this.selectedSlotType) &&
      (slot.slotNumber.toString().toLowerCase().includes(searchLower) ||
       slot.slotType.toLowerCase().includes(searchLower) ||
       (slot.benefitType && slot.benefitType.toLowerCase().includes(searchLower)))
    );
  }
  this.currentPage = 0; // Resetear a la primera página al filtrar
  this.totalRecords = this.filteredSlots.length;
}




onSearch() {
    const id = this.employeeForm.get('id')?.value;

    this.employeeService.getEmployeeById(id).subscribe({

        next: (employeeApi: any)=> {
                this.employeeData = employeeApi.data;

            if(this.employeeData.employeeHasActiveAssignments === 0 || this.employeeData.employeeHasActiveAssignments === false )
            {
              this.assignmentForm.get('employee')?.patchValue({
                  name: this.employeeData.name,
                  employeeCode: this.employeeData.employeeCode,
                  workplace: this.employeeData.workplace,
                  identifierDocument: this.employeeData.identifierDocument,
                  company: this.employeeData.company,
                  department: this.employeeData.department,
                  subManagement: this.employeeData.subManagement,
                  management1: this.employeeData.management1,
                  management2: this.employeeData.management2,
                  workSite: this.employeeData.workSite,
                  address: this.employeeData.address,
                  email: this.employeeData.email,
                  phone: this.employeeData.phone,

                  bossCode: this.employeeData.bossCode,
                  bossName: this.employeeData.bossName,
                  bossWorkplace: this.employeeData.bossWorkplace,
                  bossManagement: this.employeeData.bossManagement,
                  bossEmail: this.employeeData.bossEmail,
                  bossPhone: this.employeeData.bossPhone,
                });

                if(!this.employeeData.email){
                  this.validateEmail = true
                  this.messajeError('warn', '¡Alerta!', "El correo es oligatorio para crear la asignación.")
                }else{
                  this.validateEmail = false
                }
            }

            if(this.employeeData.employeeHasActiveAssignments === 1 || this.employeeData.employeeHasActiveAssignments === true){
              this.messajeError('warn', '¡Alerta!', "El empleado ya cuenta con una asignación.")
              this.recetAssignmentForm();
            }

            this.errorMessageSearch = '';
        },
        error: error => {
            this.errorMessageSearch = error
            this.errorMessageSearch = "El código ingresado no es valido."
            this.recetAssignmentForm();
        }
    })
}


//Agrega array nuevo vehiculo
    get vehicles(): FormArray {
      return this.assignmentForm.get('employee.vehicles') as FormArray;
    }

//Crea nuevo Array de Vehiculos
    addVehicle(): void {
        if (this.vehicles.length < 5) {
            this.vehicles.push(this.fb.group({
              //id: [''],
              vehicleBadge: ['', [Validators.required, Validators.pattern(/^[PCAOM]{1}[0-9]{3}[A-Z]{3}$/)]], // valida placas de GT
              color: ['', [Validators.required, Validators.maxLength(25)]],
              brand: ['', [Validators.required, Validators.maxLength(25)]],
              model: ['', [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
              type: ['', [Validators.required, Validators.maxLength(25)]]
            }));
          } else {
                this.messajeError('warn', '¡Alerta!', "Limite de Vehículos Alcanzado")
          }
    }


    removeVehicle(index: number): void {
      this.vehicles.removeAt(index);
    }
//End array nuevo vehiculo


//Agrega tag
    get tags(): FormArray {
        return this.assignmentForm.get('tags') as FormArray;
    }
      addTag(tag: string): void {
        this.tags.push(this.fb.control(tag, Validators.required));
      }

    removeTag(index: number): void {
      this.tags.removeAt(index);
    }


    //Agrega unicamente el id de las Tags del select al tags: this.fb.array([''])
    onTagChange(event: any): void {
        this.tags.clear();
        event.value.forEach((tag: string) => this.addTag(tag));
      }
//End agrega tag



//Búsqueda getAvailableSlots
    //Obtiene el slot y tipo de vehículo, para consumir los getAvailableSlots

   //Ontener el id seleccionado en el DropDown y pasarlo al slotsForm
   onLocationChange(event: any): void {
        const selectedLocation = event.value;
        if (selectedLocation) {
            this.slotsForm.patchValue({ locationId: selectedLocation.id });
        }
    }

    //Obtener los valores del slotForm para la búsqueda, por ubicación
    searchSlot(): void {
        const { locationId, vehicleType } = this.slotsForm.value;
        this.assignmentService.getAvailableSlots(locationId, vehicleType).subscribe(response => {
            this.slots = response.data;
             this.filteredSlots = [...this.slots];

            this.totalRecords = this.slots.length;

            // Después de cargar los slots, inicializa los filtros
            this.initializeFilters();

            if(this.slots.length <= 0){
                this.messajeError('warn', '¡Alerta!', "No hay Slots Disponibles")
            }
        });
            
    }

    //paginator
    onPageChange(event: any) {
        this.currentPage = event.page;
        this.rows = event.rows;
      }
//End Búsqueda getAvailableSlots

//CONFIRMACIÓN ELIMINAR VEHÍCULO
confirmDelVehicle(i: number) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Desea Eliminar Vehículo?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Se ha Eliminado el Vehículo', life: 1000 });

            this.removeVehicle(i);

        },
        reject: () => {
            this.messageService.add({ severity: 'info', summary: 'Continuar', detail: 'Asignación..', life: 2000 });
        }
    });
}

//CONFIRMACIÓN CANCELAR
confirmCancel() {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Desea Cancelar la Asignación?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            this.messageService.add({ severity: 'error', summary: 'Concelado', detail: 'Se ha cancelado la asignación', life: 1000 });

            setTimeout(() => {
                this.redirectSearchAssignment()
              }, 1000);

        },
        reject: () => {
            this.messageService.add({ severity: 'info', summary: 'Continuar', detail: 'Asignación..', life: 2000 });
        }
    });
}


//CONFIRMACIÓN DE ASIGNACIONES
      confirmAssignment() {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: '¿Desea crear una nueva Asignación?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon:"none",
            rejectIcon:"none",
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass:"p-button-text",
            accept: () => {
                //this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Se ha creado una nueva asignación', life: 2000 });
                this.onAssignment();
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Has cancelado la asignación', life: 2000 });
            }
        });
    }

    onAssignment() {
        this.assignmentService.createAssignment(this.assignmentForm.value).subscribe({
            next: (response: Assignments)=> {
                this.messajeCreated();
                this.recetAssignmentForm();
                this.recetEmployeeForm();
                setTimeout( () => { this.redirectSearchAssignment(); }, 1000 );
            },
                error: error => {
                    this.errorMessageAssignment = error.error.message;
                    if(this.errorMessageAssignment){
                        this.errorMessageAssignment = 'El código de empleado ya existe, No se puede crear una asignación con este código'
                        this.messajeError('error', 'error', this.errorMessageAssignment);
                    }

                    this.errorFromApi = error;
                    if(this.errorFromApi){
                        console.log("Error from API", this.errorFromApi)
                    }
                }
        })
      }

      messajeCreated(){
        this.messageService.add({ severity: 'info', summary: 'Confirmación', detail: 'Asignación Creada', life: 2000  });
      }
      messajeError(alert: string, summary: string, error: string){
        this.messageService.add({ severity: alert, summary: summary, detail: error, life: 2000 });
      }

//END CONFIRMACIÓN DE ASIGNACIONES

//GET ALL VEHICLEs
getAllVehicles(){
    this.catalogService.getVehicleTypeCatalog().subscribe({
        next: (response: any) =>{
            this.vehicleCatalog = response.data;
            const activeVehicles = this.vehicleCatalog.filter(vehicle => vehicle.isActive);

            this.vehicleTypes = [...new Set(activeVehicles.map(vehicle => vehicle.name ))];
        },
        error: error =>{
          console.warn("Error al cargar los Vehículos")
        }

    })

}




//Acciones
redirectSearchAssignment() {
    this.router.navigate(['assign-parking']); // Coloca la ruta a donde quieres redirigir
}

recetAssignmentForm() {
    this.assignmentForm.reset({
      slotId: '',
      parkingCardNumber: '',
      employee: {
        employeeCode: '',
        name: '',
        workplace: '',
        identifierDocument: '',
        company: '',
        department: '',
        subManagement: '',
        management1: '',
        management2: '',
        workSite: '',
        address: '',
        email: '',
        phone: '',
        vehicles: [],
        vehiclesForDelete: []
      },
      tags: ['']
    });
  }

  recetEmployeeForm(){
    this.employeeForm.reset({
        id: ''
    });
  }
//End Acciones
}
