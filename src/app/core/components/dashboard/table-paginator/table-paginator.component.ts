
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportService } from 'src/app/core/service/reports/report.service';
import { LocationReport } from 'src/app/core/api/reports/report.model';

@Component({
  selector: 'app-table-paginator',
  standalone: false,
  templateUrl: './table-paginator.component.html',
  styleUrl: './table-paginator.component.scss'
})
export class TablePaginatorComponent  implements OnInit {

    locationReports: LocationReport[];
    totalRecords: number = 0;
    page: number = 0;
    pageCounter: number = 0;
    eventRows: number = 0;

    constructor(private reportService: ReportService) {}

    ngOnInit() {
        this.loadlocationReports({ first: 0, rows: 20 });
    }

    loadlocationReports(event: any): Promise<any> {
        this.page = event.first / event.rows + 1;

        return new Promise((resolve, reject) => {
            this.reportService.getLocationReports(event.rows, this.page).subscribe({
                next: data => {
                    this.locationReports = data.data;
                    this.totalRecords = data.meta.totalCount;
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
                    reject(err);
                }
            });
        });
    }

}
