import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AssignmentsService } from 'src/app/core/service/assigned/assignments.service';
import { Assignments, GetEmployee, Tag } from 'src/app/core/api/assignment/assignment.model';
import { ConfirmationService, MessageService, Message } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentLoanService } from 'src/app/core/service/assignment-loan/assignment-loan.service';
import { SettingService } from 'src/app/core/service/setting.service';
import { Setting } from 'src/app/core/api/setting';
import { CatalogService } from 'src/app/core/service/management-catalog/catalog.service';
import { CatalogVehicleType } from 'src/app/core/api/management-catalog/catalog';



@Component({
  selector: 'app-guest-form',
  standalone: false,
  templateUrl: './guest-form.component.html',
  styleUrl: './guest-form.component.scss'
})
export class GuestFormComponent implements OnInit{

    //vehicleTypes: string[] = ['CARRO', 'CAMION', 'MOTO'];
    vehicleTypes: string[] = [];
    vehicleCatalog: CatalogVehicleType[];

    year: number;
    startDate:  string;
    endDate: string;

    minDate: Date;
    maxDate: Date;
    today: Date;
    maxDateGuest: Date;

    errorMessageSearch: string;
    errorMessageAssignment: string;
    errorFromApi: string;

    assignmentForm: FormGroup;


    employeeForm: FormGroup;

    employeeData: GetEmployee;

    //Para Recibir Id de la ruta
    assignment_id: string

    //CRDU GUEST
    assignments: any[] = [];
    selectedAssignment: any = {};
    displayDialog: boolean = false
    validateEmail: boolean = false;
    settings: Setting[] = [];





    constructor(private fb: FormBuilder, private assignmentLoanService: AssignmentLoanService,
                 private confirmationService: ConfirmationService, private messageService: MessageService,
                 private employeeService: AssignmentsService,
                 private route: ActivatedRoute,
                 private router: Router,
                 private settingService: SettingService,
                private catalogService: CatalogService
                )
    {
      this.assignmentForm = this.fb.group({
        //slotId: ['', [Validators.required, Validators.pattern('[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}')]],
        //parkingCardNumber: ['', Validators.required],
        startDateAssignment: [],
        endDateAssignment: [],
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
          email: [''],
          phone: [''],
          vehicles: this.fb.array([]),
          //vehiclesForDelete: this.fb.array([]),
        })
      });

    //Form para búsqueda
    this.employeeForm = this.fb.group({
      id: ['', [Validators.required, Validators.maxLength(8), Validators.pattern('^\\d+$')]]
    });

    }

    ngOnInit(): void {
        this.year = new Date().getFullYear();
        this.addVehicle();

          this.assignment_id = this.route.snapshot.paramMap.get('assignment_id');

        //CRUD GUEST
        this.loadAssignments();

        //FECHA INICIO
        this.today = new Date();

        // OBTENER FECHA DE PARAMETROS
        this.settingService.getSetting().then((data) => {
            this.settings = data;

          const maxDaysToAssignmentLoanStr = this.settings.find(
               setting => setting.settingKey === 'MAX_DAYS_TO_ASSIGNMENT_LOAN'
              )?.settingValue;

          const maxDaysToAssignmentLoan = parseInt(maxDaysToAssignmentLoanStr ?? '0', 10);
            //FECHA Asignaciones
            const today = new Date();
            this.minDate = today;
            this.maxDate = new Date();
            this.maxDate.setDate(today.getDate() + maxDaysToAssignmentLoan);
            
            //Fecha inicio invitado
            this.maxDateGuest = new Date();
            this.maxDateGuest.setDate(this.today.getDate() + maxDaysToAssignmentLoan);
        });

        this.getAllVehicles();
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

//Agrega array nuevo vehículo
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


formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

onAssignment() {
      this.startDate = this.formatDate( this.assignmentForm.get('startDateAssignment')?.value);
      this.endDate = this.formatDate(this.assignmentForm.get('endDateAssignment')?.value);

        this.assignmentForm.patchValue({
             startDateAssignment:  this.startDate,
             endDateAssignment: this.endDate
          });

        this.assignmentLoanService.createLoan(this.assignment_id, this.assignmentForm.value).subscribe({
            next: (response: Assignments)=> {
                this.messajeCreated("info", "Asignación Temporal Creada");
                this.recetAssignmentForm();
                this.recetEmployeeForm();
                setTimeout( () => { this.redirectSearchAssignment(); }, 2000 );

            },
                error: error => {
                    this.errorMessageAssignment = error.error.message;
                    if(this.errorMessageAssignment){
                        this.messajeError('error', 'error', this.errorMessageAssignment);
                    }

                    this.errorFromApi = error;
                    if(this.errorFromApi){
                        console.log("Error from API", this.errorFromApi)
                    }
                }
        })
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



//CRUD GUEST
loadAssignments(){
    //const id = 'b8370f43-ab4d-4308-849d-5a1d18a625e0'
    this.assignmentLoanService.getAssignmentById(this.assignment_id).subscribe({

        next: (dataApi: any)=> {
                this.assignments = [dataApi.data];

                this.errorMessageSearch = '';
        },
        error: error => {
            this.errorMessageSearch = error
            console.log("Error on search Guest",this.errorMessageSearch)
        }
    })

  }


  editAssignment(assignment: any): void {
    this.selectedAssignment = { ...assignment };
  }

  saveAssignment(): void {
    this.assignmentLoanService.updateAssignmentLoan(this.selectedAssignment.id, this.selectedAssignment).subscribe(() => {
      this.loadAssignments();
    });
  }

  removeAssignment(assignmentLoanId: string){
    this.assignmentLoanService.deleteAssignmentLoan(assignmentLoanId).subscribe({
        next: (response: any)=> {
            setTimeout( () => { this.redirectSearchAssignment(); }, 1000 );
        },
        error: error => {
            this.errorMessageAssignment = error.error.message;
            if(this.errorMessageAssignment){
                this.messajeError('error', 'error', this.errorMessageAssignment);
            }

            this.errorFromApi = error;
            if(this.errorFromApi){
                console.log("Erro from api", this.errorFromApi)
            }
        }
    })
  }

//CONFIRMACIÓN ELIMINAR INVITADO
confirmDelGuest(assignmentLoanId: string) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Desea Eliminar la Asignación Temporal?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Se ha Eliminado la Asignación', life: 1500 });
              this.removeAssignment(assignmentLoanId)
        },
        reject: () => {
            this.messageService.add({ severity: 'info', summary: 'Continuar', detail: 'Gestionar Invitado..', life: 1000 });
        }
    });
}
//END CRUD GUEST

//CONFIRMACIÓN DE ASIGNACIONES
confirmAssignment() {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Desea crear una nueva Asignación temporal?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            this.onAssignment();
        },
        reject: () => {
            this.messageService.add({ severity: 'warn', summary: 'Continuar', detail: 'Continua con la asignación temporal.', life: 2000 });
        }
    });
}

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
        message: '¿Desea Cancelar la Asignación temporal?',
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
            this.messageService.add({ severity: 'warn', summary: 'Continuar', detail: 'Asignación temporal', life: 2000 });
        }
    });
}


//Acciones
redirectSearchAssignment() {
    this.router.navigate(['assign-parking']); // Coloca la ruta a donde quieres redirigir
}

recetAssignmentForm() {
    this.assignmentForm.reset({
      //slotId: '',
     // parkingCardNumber: '',
     startDateAssignment: [],
     endDateAssignment: [],
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
      }
    });
  }

  recetEmployeeForm(){
    this.employeeForm.reset({
        id: ''
    });
  }

  messajeCreated(severity, message){
    this.messageService.add({ severity: severity, summary: 'Confirmed', detail: message, life: 3000  });
  }
  messajeError(alert: string, summary: string, error: string){
    this.messageService.add({ severity: alert, summary: summary, detail: error, life: 16000 });
  }
//End Acciones

}
