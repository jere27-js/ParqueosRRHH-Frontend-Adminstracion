import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AllAssignments, Datum } from 'src/app/core/api/all-locatiions/location.model'

import { AssignmentsService } from 'src/app/core/service/assigned/assignments.service';
import { CreateAcceptanceFormService } from 'src/app/core/service/acceptance-form/create-acceptance-form.service';
import { UpdateStatusForm } from 'src/app/core/api/create-acceptance-form/updateStatusForm.model';
import { UnassignedParking } from '../../../../api/create-acceptance-form/unassignedParking.model';
import { UnassignedParkingService } from '../../../../service/assigned/unassigned-parking.service';
import { DiscountNoteService } from '../../../../service/discount-note/discount-note.service';
import { UpdateStatusDiscountNote } from '../../../../api/discount-note/updateStatusDiscountNote.model';
import { Table } from 'primeng/table';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-search-assigned',
  standalone: false,
  templateUrl: './search-assigned.component.html',
  styleUrl: './search-assigned.component.scss'
})
export class SearchAssignedComponent implements OnInit{

    pageCounter: number = 0;
    currentPage: number = 1;
    //  limit: number = 5;
    eventRows: number = 0;

    totalRecords: number = 0;
    registros = 5;
    loading: boolean = true;

    productDialog: boolean = false;

    selectedAssignments!: Datum | null;
    selecteds!:  AllAssignments[];

    submitted: boolean = false;

    statuses!: any[];

    //Formulario de aceptación
    visibleForm: boolean = false;
    visibleFormOptions: boolean = false;

    //Opciones Formulario
    displayDialog1: boolean = false;

    //bajas
    displayDialog2: boolean = false;
    date: Date | undefined;
    //today: string;
    today: Date;
    maxDate: Date;
    descripcion: string = '';


    //Nota de Descuento
    displayDialog3: boolean = false;
    benefitType: string;
    discountNote_id: string;
    discountNoteStatus: string;
    statusSignature: string;
    lastNotice: string;
    statusDispatched: string;
    assignmentDate: string;
    employeeName: string;
    employeeEmail: string;

    //Estado Nota de Descuento
    displayDialog4: boolean = false;
    selectedItem: any;

    assignment_id: string;

   //Estado de los botones
    accepFomButtonDisabled: boolean = true;
    optionFomButtonDisabled: boolean = true;
    deallocatedFomButtonDisabled: boolean = true;
    discountNoteButtonDisabled: boolean = true;
    sendDiscountNoteButtonDisabled: boolean = false;
    statusNoteButtonDisabled: boolean = true
    guestFomButtonDisabled: boolean = true

    //patch api
    errorMessageUpdateForm: string;
    errorFromApi: string;

    //búsqueda
    filteredAssignments: Datum[] = [];
    currentFilter: string = '';
    parkingLocations: Datum[] = [];
    statusType: string;

    //invitado
    label: string = 'Agregar Invitado';
    icon: string = 'pi pi-plus';

    @ViewChild('dt') dt: Table; // Obtener referencia a la tabla


constructor(private router: Router, private assignmentsService: AssignmentsService,
                        private messageService: MessageService,
                        private createAcceptanceFormService: CreateAcceptanceFormService,
                        private unassignedParkingService: UnassignedParkingService,
                        private discountNoteService: DiscountNoteService,
                        private updateStatusDiscountNote: DiscountNoteService,
                        private confirmationService: ConfirmationService,
                    ) {}

    ngOnInit() {

        //MI SERVICIO
        this.loadParkingLocations({ first: 0, rows: 5 });

        const date = new Date();
       // this.today = date.toISOString().split('T')[0]; // Formato yyyy-MM-dd

        this.today = new Date();
    }

      redirectToAcceptanceForm() {
        this.router.navigate(['assign-parking/acceptance-form', { assignment_id: this.assignment_id }]);
        this.clearSelecction();
      }

loadParkingLocations(event: any){

const page = event.first / event.rows + 1;

this.assignmentsService.getAllAssignments(event.rows, page).subscribe(response => {
    this.parkingLocations = response.data;
     this.pageCounter = response.pageCounter;
     this.eventRows = event.rows;

         // Recorre el paginado para nextPage
         const requests = [];
         for (let i = 1; i < this.pageCounter; i++) {
             const nextPage = page + i;
             requests.push(lastValueFrom(this.assignmentsService.getAllAssignments(event.rows, nextPage)));
         }

        // Ejecuta todas las solicitudes en paralelo
        Promise.all(requests).then(responses => {
            responses.forEach(response => {
                const additionalAssignments = response.data || [];
                if (Array.isArray(additionalAssignments)) {
                    this.parkingLocations = [...this.parkingLocations, ...additionalAssignments];

                        //Aplana el array slots para que funcione el sort
                        this.parkingLocations = this.parkingLocations.map(location => ({
                            ...location, slotNumber: location.location.slots.length > 0 ? location.location.slots[0].slotNumber : null
                            }));
                }
            });

        }).catch(error => {
            console.error("Error al cargar las páginas adicionales", error);
        });

 });
}

onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        table.filterGlobal(inputValue, 'startsWith');
}


benefi( benefi: string) {
    switch ( benefi) {
        case 'SIN_COSTO':
            return 'Sin Costo';
        case 'COMPLEMENTO':
            return 'Complemento';
        case 'DESCUENTO':
            return 'Descuento';
        }
    return false
}


status(status: string) {
    switch (status) {
        case 'ACTIVO':
            return 'Activo';
        case 'ASIGNADO':
            return 'Asignado';
        case 'ACEPTADO':
            return 'Aceptado';
        case 'EN_PROGRESO':
            return 'En Progreso';
        case 'CANCELADO':
            return 'Cancelado';
        case 'RECHAZADO':
            return 'Rechazado';
        case 'BAJA_MANUAL':
            return 'Baja Manual';
        case 'BAJA_AUTOMATICA':
            return 'Baja Automática';
        }
    return false
}


getSeverity(status: string) {
    switch (status) {
        case 'ACTIVO':
            return 'primary';
        case 'ASIGNADO':
            return 'info';
        case 'ACEPTADO':
            return 'success';
        case 'EN_PROGRESO':
            return 'help';
        case 'CANCELADO':
            return 'contrast';
        case 'RECHAZADO':
            return 'secondary';
        case 'BAJA_MANUAL':
            return 'warning';
        case 'BAJA_AUTOMATICA':
            return 'danger';
        }
    return false
}

statusLoan(){

}


    showDialog() {
        this.visibleForm = true;  //Formulario de aceptación
    }

    redirectAssignmentform() {
        this.router.navigate(['assign-parking/assignment-form']); // Coloca la ruta a donde quieres redirigir
        this.clearSelecction();
    }

 // Nota Descuento Método para verificar si la fila está seleccionada
  isRowSelected(parkingLocation: Datum): boolean {
    return this.selectedAssignments && this.selectedAssignments.id === parkingLocation.id;

  }

    onRowSelect(event: any) {
    this.messageService.add({ severity: 'info', summary: 'Seleccionado', detail: event.data.employee.name, life: 1000  });

        this.benefitType = event.data.benefitType;

        this.assignment_id = event.data.id;

        if(event.data.status === 'EN_PROGRESO'){
            this.optionFomButtonDisabled = false;
        }
        if(event.data.status !== 'EN_PROGRESO'){
            this.optionFomButtonDisabled = true;
        }


        if(event.data.status === "ASIGNADO"){
            this.accepFomButtonDisabled = false;

        }
        if(event.data.status !== "ASIGNADO"){
            this.accepFomButtonDisabled = true;
        }


        if(event.data.status === "ACEPTADO"){
            this.deallocatedFomButtonDisabled = false
        }
        if(event.data.status !== "ACEPTADO"){
            this.deallocatedFomButtonDisabled = true
        }

        //NOTA DESCUENTO
        if(event.data.benefitType === "DESCUENTO"){
            this.discountNoteButtonDisabled = false

        }
        if(event.data.benefitType !== "DESCUENTO" ){
            this.discountNoteButtonDisabled = true

        }

        if(event.data.status === "BAJA_MANUAL"){
            this.discountNoteButtonDisabled = true
        }

        if(event.data.status !== "BAJA_MANUAL"){
            this.discountNoteButtonDisabled = false
        }

        if(event.data.status === "CANCELADO"){
            this.discountNoteButtonDisabled = true
        }

        if(event.data.status !== "CANCELADO"){
            this.discountNoteButtonDisabled = false
        }


        //VALIDA SI VIENE NOTA DE DESCUENTO
        if(event.data.discountNote){
            this.discountNote_id = event.data.discountNote.id;

            this.statusSignature = event.data.discountNote.statusSignature;

            this.lastNotice = event.data.discountNote.lastNotice;
            this.statusDispatched = event.data.discountNote.statusDispatched;
            this.assignmentDate  = event.data.assignmentDate;
            this.employeeName  = event.data.employee.name;
            this.employeeEmail  = event.data.employee.email;


        }
        else{
            this.discountNoteButtonDisabled = true
        }

        //REENVIO DE NOTA
        if(event.data.discountNote){
            this.discountNoteStatus = event.data.discountNote.statusDispatched

            if(event.data.discountNote.statusDispatched === 'PENDIENTE'){
                this.sendDiscountNoteButtonDisabled = false
            }

            if(event.data.discountNote.statusDispatched !== 'PENDIENTE'){
                this.sendDiscountNoteButtonDisabled = true
            }

            if((event.data.status === "BAJA_MANUAL") && (event.data.discountNote.statusDispatched === "PENDIENTE")){
                this.discountNoteButtonDisabled = true
            }
            if((event.data.status !== "BAJA_MANUAL") && (event.data.discountNote.statusDispatched !== "PENDIENTE")){
                this.discountNoteButtonDisabled = false
            }

        }

        //Nota de Descuento
        this.statusNoteButtonDisabled = false

        //INVITADO
        if(event.data.status === "ACEPTADO"){
            this. guestFomButtonDisabled = false;

        }
        if(event.data.status !== "ACEPTADO"){
            this. guestFomButtonDisabled = true;
        }

      //Estado botton invitado
      if(event.data.assignmentLoan && event.data.assignmentLoan.status  === 'ACTIVO'){
       this.label = 'Editar Invitado'
       this.icon = 'pi pi-user-edit';
      }

      if(!event.data.assignmentLoan){
       this.label = 'Agregar Invitado'
       this.icon = 'pi pi-plus';
      }

}

    onRowUnselect(event: any) {
    this.messageService.add({ severity: 'info', summary: 'Deseleccionado', detail: event.data.employee.name, life: 1000  });
    this.assignment_id = '000';

    this.accepFomButtonDisabled = true;
    this.optionFomButtonDisabled = true;
    this.deallocatedFomButtonDisabled = true
    this.discountNoteButtonDisabled = true
    this.sendDiscountNoteButtonDisabled = false
    this.guestFomButtonDisabled = true;

    }


//ESTADOS DE FORMULARIO
    //ACEPTADO
    acceptedForm(){
       const status = 'ACEPTADO'
       this.updateStatusForm(status)
       this.closeDialog();
    }
    //RECHAZADO
    refusedForm(){
        const status = 'RECHAZADO'
        this.updateStatusForm(status)
        this.closeDialog();
     }

     //CANCELADO
     canceledForm(){
        const status = 'CANCELADO'
        this.updateStatusForm(status)
        this.closeDialog();
     }


    updateStatusForm(status:string){
        const body = {
        status: status
        }

        this.createAcceptanceFormService.patchStatusForm(this.assignment_id, body).subscribe({
            next: (response: UpdateStatusForm)=> {
                this.messajeCreated(status)
                setTimeout( () => { this.redirectSearchAssignment(); }, 2000 );

            },
                error: error => {
                    this.errorMessageUpdateForm = error.error.message;
                    if(this.errorMessageUpdateForm){
                        this.messajeError(this.errorMessageUpdateForm);
                    }
                    this.errorFromApi = error;
                    if(this.errorFromApi){
                        console.log("Error from API", this.errorFromApi)
                    }
                }
        })

    }
//END ESTADOS DE FORMULARIO


// BAJA MANUAL
confirmDell() {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Dar de baja a la asignación?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
            this.deallocated();
        },
        reject: () => {
            this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Has cancelado dar de baja', life: 2000 });
        }
    });
}

deallocated(){
    this.unassignedParking();
    this.closeDialog2();
 }

 //Valida Boton de Baja
get disabledButonBaja(): boolean {
  return !this.descripcion || !this.date;
}

 //BAJA CANCELAR
confirmCancel() {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Cancelar baja de la asignación?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        rejectButtonStyleClass: 'p-button-text',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Se ha cancelado la baja manual', life: 2000 });
            this.displayDialog2 = false;
            this.date = null;
        },
        reject: () => {
            this.messageService.add({ severity: 'warn', summary: 'Cancelado', detail: 'Continua con la baja manual', life: 2000 });
        }
    });
}


 formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

 unassignedParking(){
    const formattedDate = this.formatDate(this.date);

    const body = {
        reason: this.descripcion,
        deAssignmentDate: formattedDate
        }
    const status = 'Baja Realizada'
        this.unassignedParkingService.UnassignedParking(this.assignment_id, body).subscribe({
            next: (response: UnassignedParking)=> {
                this.messajeCreated(status)
                setTimeout( () => { this.redirectSearchAssignment(); }, 2000 );

            },
                error: error => {
                    this.errorMessageUpdateForm = error.error.message;
                    if(this.errorMessageUpdateForm){
                        this.messajeError(this.errorMessageUpdateForm);
                    }
                    this.errorFromApi = error;
                    if(this.errorFromApi){
                        console.log("Eror from API", this.errorFromApi)
                    }
                }
        })
 }
// END BAJAS


//NOTA DE DESCUENTO
discountNote(){
    const status = 'Nota Enviada'

    this.discountNoteService.createNotification (this.discountNote_id).subscribe({
        next: (response: any)=> {
            this.messajeCreated(status)
            setTimeout( () => { this.closeDialog3(); }, 1000 );

        },
            error: error => {
                this.errorMessageUpdateForm = error.error.message;
                if(this.errorMessageUpdateForm){
                    this.errorMessageUpdateForm = 'Nota no Permitida'
                    this.messajeError(this.errorMessageUpdateForm);
                    setTimeout( () => { this.closeDialog3(); }, 1000 );
                }
                this.errorFromApi = error;
                if(this.errorFromApi){
                    console.log("Error from API", this.errorFromApi)
                }
            }
    })

}
//END NOTA DE DESCUENTO

//ESTADOS DE NOTA DE DESCUENTO
//ACEPTADO
approveddNote(){
    const status = 'APROBADO'
    this.updateStatusNote(status)
    this.closeDialog3();
 }
 //RECHAZADO
 refusedNote(){
     const status = 'RECHAZADO'
     this.updateStatusNote(status)
     this.closeDialog3();
  }

  //CANCELADO
  canceledNote(){
     const status = 'CANCELADO'
     this.updateStatusNote(status)
     this.closeDialog3();
  }


 updateStatusNote(status:string){
     const body = {
     status: status
     }

     this.updateStatusDiscountNote.updateStatusDiscountNote (this.discountNote_id, body).subscribe({
         next: (response: UpdateStatusDiscountNote)=> {
             this.messajeCreated(status)
             setTimeout( () => { this.redirectSearchAssignment(); }, 2000 );

         },
             error: error => {
                 this.errorMessageUpdateForm = error.error.message;
                 if(this.errorMessageUpdateForm){
                     //Setear mensaje:
                     this.errorMessageUpdateForm = "Acción No Permitida, Nota ya Aceptada"
                     this.messajeError(this.errorMessageUpdateForm);
                 }
                 this.errorFromApi = error;
                 if(this.errorFromApi){
                     console.log("Error from API Note", this.errorFromApi)
                 }
             }
     })

 }
//END ESTADOS DE NOTA


//GUEST
redirectToGuestForm() {
    this.router.navigate(['assign-parking/guest-form', { assignment_id: this.assignment_id }]);
    this.clearSelecction();
  }
//END GUEST

//Limpia la vista de la selección al cambiar de pantalla
clearSelecction(){
      if (this.dt) {
        this.dt.selection = null;
        this.dt.clearState(); 
      }

}


//ACCIONES
messajeCreated(status: string){
    this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: status, life: 2000  });
  }
  messajeError(error: string){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 2000 });
  }

  redirectSearchAssignment() {
      this.router.navigate(['assign-parking']).then(() => {
          window.location.reload();
        });
        this.clearSelecction();
    }

    closeDialog(){
       this.displayDialog1 = false;
    }

    closeDialog2(){
        this.displayDialog2 = false;
        this.date = null;
     }
     closeDialog3(){
        this.displayDialog3 = false;
     }

message(severity: string, summary: string, detail:string){
    this.messageService.add({ severity: severity, summary: summary, detail: detail , life: 2000  });
  }
// END ACCIONES

}

