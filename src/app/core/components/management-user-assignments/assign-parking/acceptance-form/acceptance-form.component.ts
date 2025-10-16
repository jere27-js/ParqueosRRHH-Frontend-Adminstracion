import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AcceptanceService } from '../../../../service/acceptance-form/acceptance.service';
import { AcceptanceForm, Signatures } from 'src/app/core/api/acceptance-form/acceptanceForm.model';
import { CreateAcceptanceFormService } from 'src/app/core/service/acceptance-form/create-acceptance-form.service';
import { CreateAcceptanceForm } from '../../../../api/create-acceptance-form/createAcceptanceForm.model';
import { ConfirmationService, MessageService, Message } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-acceptance-form',
  standalone: false,
  templateUrl: './acceptance-form.component.html',
  styleUrl: './acceptance-form.component.scss',
})


export class AcceptanceFormComponent implements OnInit {


    //PASO 1
    numSolicitud = 'Generado por el Backend';
    fecha: Date | undefined;
    //PASO 4
    signatures: Signatures;


//@Input() assignment_id: string;
assignment_id: string;
assignmentData: AcceptanceForm;

//Radio button
reembolsoStatus: boolean = false;
descuentoStatus: boolean = false;
exonera: string;
formateExonera: boolean;

errorMessageCreateForm: string;

errorFromApi: string;

    //Formulario de aceptación
    visibleForm: boolean = false;
    today: string;
    today2: string;




constructor(private acceptanceService: AcceptanceService, private createAcceptanceFormService: CreateAcceptanceFormService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService,
    ) { }

  ngOnInit(){
    this.assignment_id = this.route.snapshot.paramMap.get('assignment_id');
        this.loadAssignmentData(this.assignment_id);

        const date = new Date();
       
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
        const year = date.getFullYear();
        this.today2 = `${day}/${month}/${year}`; // Formato dd/MM/yyyy

        //Formato valido para el endPoint
        this.today = date.toISOString().split('T')[0]; // Formato yyyy-MM-dd

  }

  private loadAssignmentData(assignmentId: string): void {

      this.acceptanceService.getAcceptanceData(assignmentId).subscribe(data => {
        this.assignmentData = data;
            // Parsea el JSON y asigna el tipo Signatures
            this.signatures = JSON.parse(this.assignmentData.data.signatures) as Signatures;

            //bloquear radio button reembolso
            if(this.assignmentData.data.currAssignment.benefitType === 'DESCUENTO' || this.assignmentData.data.currAssignment.benefitType === 'SIN_COSTO' ){
                this.reembolsoStatus = true
            }
            //Bloquear radio button descuento
            if(this.assignmentData.data.currAssignment.benefitType === 'COMPLEMENTO' || this.assignmentData.data.currAssignment.benefitType === 'SIN_COSTO' ){
                this.descuentoStatus = true
            }
      });
  }

   onSubmit() {
    this.assignment_id = this.route.snapshot.paramMap.get('assignment_id');
        this.onCreateForm()
        setTimeout( () => { this.redirectSearchAssignment(); }, 2000 );
  }

objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }


// API CREATE ACCEPTANCE FORM

formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

onCreateForm() {
    const formattedDate = this.today;

    if(this.exonera == 'true'){
      this.formateExonera = true

    }
    if(this.exonera == 'false'){
        this.formateExonera = false
    }

     const body = {
      isDiscountWaiver: this.formateExonera,
      assignmentDate: formattedDate
    }

    this.createAcceptanceFormService.createForm(this.assignment_id, body).subscribe({
        next: (response: CreateAcceptanceForm)=> {
            this.message("info", "Confirmación", "Formulario Enviado")
            setTimeout( () => { this.redirectSearchAssignment(); }, 2000 );

        },
            error: error => {
                this.errorMessageCreateForm = error.error.message;
                if(this.errorMessageCreateForm){
                    this.messajeError(this.errorMessageCreateForm);

                }

                this.errorFromApi = error;
                if(this.errorFromApi){
                    console.log("Error From API", this.errorFromApi)
                }
            }
    })
  }

//CONFIRMACIÓN DE FORMULARIO
confirmForm(){
    this.confirm('¿Estás seguro de enviar el formulario?', 'Confirmación', 'pi pi-exclamation-triangle', this.onSubmit.bind(this),
                    this.message.bind(this, "warn","Cancelado", "Has cancelado el envío del Formulario") ); //Función como parametro
}

cancelForm(){
    this.confirm('¿Estás seguro de salir del formulario?', 'Confirmación', 'pi pi-exclamation-triangle', this.redirectSearchAssignment.bind(this),
                    this.message.bind(this, "warn","Cancelado", "Continua con el Formulario") ); //Función como parametro
}


//ACCIONES
confirm(message: string, header: string, icon: string, acceptCallback: () => void, messageCallback: () => void) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: message,
        header: header,
        icon: icon,
        acceptIcon: "none",
        rejectIcon: "none",
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        rejectButtonStyleClass: "p-button-text",
        accept: () => {
            acceptCallback();
        },
        reject: () => {
            messageCallback();
        }
    });
}
//MESSAGE USADO EN CONFIRM
message(severity: string, summary: string, detail:string){
    this.messageService.add({ severity: severity, summary: summary, detail: detail , life: 2000  });
  }
  messajeError(error: string){
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error, life: 16000 });
  }

  redirectSearchAssignment() {
      this.router.navigate(['assign-parking']).then(() => {
          window.location.reload();
        });
    }
// END API CREATE ACCEPTANCE FORM
}
