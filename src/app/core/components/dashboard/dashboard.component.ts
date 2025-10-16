import { Component, OnInit } from '@angular/core';
import { OverviewService } from '../../service/dashboar/overview.service';
import { OverView } from '../../api/dashboard/overView.model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

    // Datos del Dashboard
    overviewData: OverView = {
        totalSlots: 0,
        availableSlots: 0,
        unavailableSlots: 0,
        occupiedSlots: 0
    };

    constructor(private overviewService: OverviewService) {}

    ngOnInit() {
        this.loadOverviewData();
    }

    loadOverviewData() {
        this.overviewService.getStatusOverviewData().subscribe(
            response => {
                this.overviewData = response.data;
            },
            error => {
                console.error('Error al obtener datos del dashboard:', error);
            }
        );
    }
}
