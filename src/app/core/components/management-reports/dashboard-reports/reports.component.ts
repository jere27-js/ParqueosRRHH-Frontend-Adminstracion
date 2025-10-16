import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { ExcelService } from 'src/app/core/service/excel.service';
import { LocationReport, EmployeeReport, EmployeeDetailCostReport, ParkingAssignedPeriodReport } from '../../../api/reports/report.model';
import { ReportService } from '../../../service/reports/report.service';
import { first } from 'rxjs';
import { Datum } from '../../../api/all-locatiions/location.model';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css'],
    standalone: false,
})


export class ReportsComponent implements OnInit {
    cols: any[] = []; // Tus columnas aquí

    locationReports: LocationReport[];
    employeeReports: EmployeeReport[];
    employeeDetailCostReports: EmployeeDetailCostReport[];
    parkingAssignedPeriodReport: ParkingAssignedPeriodReport[];
    startDate: Date | undefined;
    endDate: Date | undefined;
    loading: boolean = false;

    assignments: any[] = [];
    assignments2: any[] = [];
    totalRecords: number = 0;
    page: number = 0;
    pageCounter: number = 0;
    eventRows: number = 0;

    selectedReport: number = 0; // Reporte seleccionado
    selectedDepartment: string; // Departamento seleccionado
    selectedPosition: string;   // Puesto seleccionado
    reportData: any[] = []; // Almacena los datos de cada reporte
    filteredData: any[] = []; // Almacena los datos filtrados
    //---------------

    //Simulando reportes existentes
    reportOptions: SelectItem[] = [
        { label: 'Resumen por Ubicación', value: 1 },
        { label: 'Detalle por Colaborador', value: 2 },
        { label: 'Detalle por Colaborador con Costo', value: 3 },
        { label: 'Parqueos Asignados por Periodo de Tiempo Determinado', value: 4 }
    ];

    //Filtros dinamicos para reporte 2
    additionalAssignments: EmployeeReport[];
    departments: string[] = [];
    allDepartments: string[] = [];
    positions: string[] = [];
    //Filtros dinamicos para reporte 3
    departments3: string[] = [];
    positions3: string[] = [];
    address3: string[] = [];
    benefit: string[] =[];
    selectedAddress: string;
    selectedBenefit: string;
    //Reporte 4
    PeriodReport: ParkingAssignedPeriodReport[];
    fechaInico: string;
    fechaFin: string;

constructor(private excelService: ExcelService, private reportService: ReportService) {}


ngOnInit() {

    //WEB SERVICE
    this.loadEmployeeReports({ first: 0, rows: 20 });
    this.loadEmployeeDetailCostReports({ first: 0, rows: 20 });
}


//REPORTE1
loadlocationReports(event: any): Promise<any> {
    this.loading = true;
    this.page = event.first / event.rows + 1;

    return new Promise((resolve, reject) => {
        this.reportService.getLocationReports(event.rows, this.page).subscribe({
            next: data => {
                this.locationReports = data.data;
                this.totalRecords = data.meta.totalCount;
                this.loading = false;
                this.pageCounter = data.meta.pageCounter;
                this.eventRows = event.rows;

                const requests = [];
                for (let i = 1; i < this.pageCounter; i++) {
                    const nextPage = this.page + i;
                    requests.push(this.reportService.getLocationReports(event.rows, nextPage));
                }

                let completedRequests = 0;
                requests.forEach(request => {
                    request.subscribe({
                        next: additionalData => {
                            this.locationReports = [...this.locationReports, ...additionalData.data];
                            completedRequests++;
                            if (completedRequests === requests.length) {
                                resolve(this.locationReports);

                            }
                        },
                        error: err => {
                            reject(err);
                        }
                    });
                });

                if (requests.length === 0) {
                    resolve(this.locationReports);
                }
            },
            error: err => {
                this.loading = false;
                reject(err);
            }
        });
    });
}


//GET REPORTE 2
loadEmployeeReports(event: any) {
    this.loading = true;
    this.page = event.first / event.rows + 1;

    this.reportService.getEmployeeReports(event.rows, this.page).subscribe(data => {
      this.employeeReports = data.data;

      this.totalRecords = data.meta.totalCount;
      this.loading = false;

      this.pageCounter = data.meta.pageCounter;
      this.eventRows = event.rows;

      const requests = [];
      for (let i = 1; i < this.pageCounter; i++) {
        const nextPage = this.page + i;
        requests.push(lastValueFrom(this.reportService.getEmployeeReports(event.rows, nextPage)));
      }

      // Ejecuta todas las solicitudes en paralelo
      Promise.all(requests).then(responses => {
        responses.forEach(response => {
          const additionalAssignments = response.data || [];
          if (Array.isArray(additionalAssignments)) {
            this.employeeReports = [...this.employeeReports, ...additionalAssignments];
          }
        });

        // Filtros
        this.departments = [...new Set(this.employeeReports.map(empleado => empleado.department))];
        this.positions = [...new Set(this.employeeReports.map(empleado => empleado.position))];

      }).catch(error => {
        console.error("Error al cargar los reportes adicionales", error);
      });
    });
  }

  //GET REPORTE 3
  loadEmployeeDetailCostReports(event: any) {
    this.loading = true;
    this.page = event.first / event.rows + 1;

    this.reportService.getEmployeeDetailCostReport(event.rows, this.page).subscribe(data => {
        this.employeeDetailCostReports = data.data;

        this.totalRecords = data.meta.totalCount;
        this.loading = false;

        this.pageCounter = data.meta.pageCounter;
        this.eventRows = event.rows;

        // Recorre el paginado para nextPage
        const requests = [];
        for (let i = 1; i < this.pageCounter; i++) {
            const nextPage = this.page + i;
            requests.push(lastValueFrom(this.reportService.getEmployeeDetailCostReport(event.rows, nextPage)));
        }

        // Ejecuta todas las solicitudes en paralelo
        Promise.all(requests).then(responses => {
            responses.forEach(response => {
                const additionalAssignments = response.data || [];
                if (Array.isArray(additionalAssignments)) {
                    this.employeeDetailCostReports = [...this.employeeDetailCostReports, ...additionalAssignments];
                }
            });

            // Filtros
            this.departments3 = [...new Set(this.employeeDetailCostReports.map(empleado => empleado.department))];
            this.positions3 = [...new Set(this.employeeDetailCostReports.map(empleado => empleado.position))];
            this.address3 = [...new Set(this.employeeDetailCostReports.map(empleado => empleado.address))];
            this.benefit = [...new Set(this.employeeDetailCostReports.map(empleado => empleado.assignment.benefitType))];
            this.benefit = this.benefit.map(item => item === "SIN_COSTO" ? "SIN COSTO" : item);

        }).catch(error => {
            console.error("Error al cargar los reportes adicionales", error);
        });
    });
}

  //GET REPORTE 4
    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
      }
    loadParkingAssignedPeriodReport(event: any) {

        this.loading = true;
        this.page = event.first / event.rows + 1;
        const START_DATE = this.formatDate(this.startDate);
        this.fechaInico = START_DATE;
        const END_DATE = this.formatDate(this.endDate);
        this.fechaFin = END_DATE;

        this.reportService.getParkingAssignedPeriodReport(event.rows, this.page, this.fechaInico, this.fechaFin).subscribe(data => {
          this.PeriodReport = data.data;

          this.totalRecords = data.meta.totalCount;
          this.loading = false;

          this.pageCounter = data.meta.pageCounter;
          this.eventRows = event.rows;

            // Recorre el paginado para nextPage
            for (let i = 1; i < this.pageCounter; i++) {
                const nextPage = this.page + i;
                this.reportService.getParkingAssignedPeriodReport(event.rows, this.page, this.fechaInico, this.fechaFin).subscribe(data => {
                const additionalAssignments = data.data;
                this.PeriodReport = [...this.PeriodReport, ...additionalAssignments]; //Agrega los item del array additionalAssignments al array locationReports
                });
            }
        });
      }


    load() {
        this.loading = true;
        this.loadParkingAssignedPeriodReport({ first: 0, rows: 20 });
   
            this.fetchParkingAssignedPeriod();
     
    }




    //TABLE TO EXCEL SERVICE
    exportTable(tableId: string, fileName: string): void {
         this.excelService.exportTableToExcel(tableId, fileName);
    }
    //ALL DATA TO EXCEL
    exporlocationReport(fileName: string) {
        const renamedArray = this.locationReports.map(item => ({
            "Nombre de Parqueo": item.parkingName,
            "Número de Voluntaria": item.numberOfIdentifier,
            "Espacios sin Costo": item.noCost,
            "Espacios con Reembolso": item.reimbursement,
            "Espacios con Descuento": item.discount,
            "Espacios para Carros": item.vehicleCount,
            "Espacios para Motos": item.motorcycleCount,
            "Espacios para Camiones": item.truckCount,
            "Total de Espacios": item.totalSpaces,
            "Espacios Ocupados": item.occupiedSpaces,
            "Espacios Disponibles": item.availableSpaces,
            "Indice de Ocupación": item.occupancyRate,
          }));
        this.excelService.exportAllDataToExcel(renamedArray, fileName );
    }

     exportReport2(fileName: string) {
          const renamedArrayReport2 = this.filteredData.map(item => ({
            "Código de Colaborador": item.employeeCode,
            "Nombre Colaborador": item.employeeName,
            "Puesto Colaborador": item.position,
            "Departamento": item.department,
            "Subgerencia": item.subManagement,
            "Gerencia 1": item.management1,
            "Gerencia 2": item.management2,
            "Dirección": item.address,
            "Sede": item.work_site,
            "Nombre del parqueo": item.assignment.slot.location.parkingName,
            "Tipo de Beneficio": item.assignment.slot.benefitType,
            "Fecha de Asignación": item.assignment.assignmentDate,
             "Fecha de Baja": item.assignment.de_assignment?.endDate,
          }));
       
        this.excelService.exportAllDataToExcel(renamedArrayReport2, fileName );
    }

     exportReport3(fileName: string) {
          const renamedArrayReport3 = this.filteredData.map(item => ({
            "Código de Colaborador": item.employeeCode,
            "Nombre Colaborador": item.employeeName,
            "Puesto Colaborador": item.position,
            "Departamento": item.department,
            "Subgerencia": item.subManagement,
            "Gerencia 1": item.management1,
            "Gerencia 2": item.management2,
            "Dirección": item.address,
            "Sede": item.site,
            "Nombre del parqueo": item.assignment.slot.location.parkingName,
            "Número de Voluntaria": item.assignment.slot.location.volunteerNumber,
            "Tipo de Beneficio": item.assignment.benefitType,
            "Fecha de Asignación": item.assignment.assignmentDate,
            "Monto del Reembolso": item.refundAmount,
            "Monto de Descuento": item.discountAmount,
          }));
       
        this.excelService.exportAllDataToExcel(renamedArrayReport3, fileName );
    }

    exportReport4(fileName: string) {
          const renamedArrayReport4 = this.filteredData.map(item => ({
            "Fecha de Inicio": this.startDate,
            "Fecha de Fin": this.endDate,
            "Código de Colaborador": item.employeeCode,
            "Nombre Colaborador":  item.employeeName,
            "Puesto Colaborador":  item.position,
            "Departamento":  item.department,
            "Gerencia 1": item.management1,
            "Nombre del Parqueo": item.assignment?.slot?.location?.parkingName,
            "Número de Parqueo":  item.assignment?.slot?.parkingCarNumber,
            "Fecha de Asignación": item.assignment.assignmentDate
          }));
       
        this.excelService.exportAllDataToExcel(renamedArrayReport4, fileName );
    }

    
    // Función para obtener los datos del reporte seleccionado
    fetchReport(reportType: number) {
        this.reportData = []; // Limpiar los datos al cambiar de reporte
        this.filteredData = []; // Limpiar los datos filtrados
        switch (reportType) {
            case 1:
                this.fetchResumenPorUbicacion();
                break;
            case 2:
                this.fetchDetallePorColaborador();
                break;
            default:
                break;
            case 3:
                this.fetchEmployeeDetailCost();
                break;
            case 4:
               // this.fetchParkingAssignedPeriod();
                break;
        }
    }


//Seleccionar reporte case para dropdown
//datas reporte 1
    async fetchResumenPorUbicacion() {
        try {
            this.reportData = await this.loadlocationReports({ first: 0, rows: 20 });
            this.filteredData = [...this.reportData]; // Copiar los datos al array filtrado
        } catch (error) {
            console.error('Error fetching location reports:', error);
        }
    }


//datos reporte 2
    fetchDetallePorColaborador() {
        this.reportData = this.employeeReports;
        this.filteredData = [...this.reportData];
    }



//aplicar los filtros reporte 2 y 3
    filterReportData() {
        this.filteredData = this.reportData.filter(item => {
            let departmentMatch = true;
            let positionMatch = true;
            let addressMatch = true;
            let benefitMatch = true;

            // Filtro por Departamento
            if (this.selectedDepartment) {
                departmentMatch = item.department === this.selectedDepartment;
            }
            // Filtro por Puesto
            if (this.selectedPosition) {
                positionMatch = item.position === this.selectedPosition;
            }
             // Filtro por dirección
             if (this.selectedAddress) {
                addressMatch = item.address === this.selectedAddress;
            }
              // Filtro por beneficio
              if (this.selectedBenefit) {
                benefitMatch = item.assignment.benefitType === this.selectedBenefit;
            }


            // Retorna true si los filtros coinciden
            return departmentMatch && positionMatch && addressMatch && benefitMatch;
        });
    }


     //datos reporte 3
     fetchEmployeeDetailCost() {
        this.reportData = this.employeeDetailCostReports
        this.filteredData = [...this.reportData];

        //Mapea el array para quitar el _
        this.filteredData = this.filteredData.map(item => {
            if (item.assignment.benefitType === "SIN_COSTO") {
                item.assignment.benefitType = "SIN COSTO";
            }
            return item;
        });

    }

    //datos reporte 4
    fetchParkingAssignedPeriod() {

         setTimeout(() => {
            this.loading = false
            this.reportData = this.PeriodReport;
            this.filteredData = [...this.reportData];
        }, 100);
    }


    // Función para aplicar un filtro de búsqueda global en la tabla
    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        table.filterGlobal(inputValue, 'contains');
    }

};
