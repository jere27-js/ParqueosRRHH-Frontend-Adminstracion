import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { OverviewService } from 'src/app/core/service/dashboar/overview.service';

@Component({
  selector: 'app-line-bar',
  standalone: false,
  templateUrl: './line-bar.component.html',
  styleUrl: './line-bar.component.scss'
})
export class LineBarComponent implements OnInit {

    data: any;

    options: any;

    constructor(private overviewService: OverviewService) {}


    ngOnInit() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: { color: textColor }
        }
      },
      scales: {
        x: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } },
        y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } }
      }
    };

    this.loadChartData();
  }

  loadChartData() {
    const documentStyle = getComputedStyle(document.documentElement);
    this.overviewService.getParkingAvailability().subscribe(response => {
      this.data = {
        labels: response.data.months,
        datasets: [
          { label: 'Espacios Ocupados', data: response.data.occupied, borderColor: documentStyle.getPropertyValue('--red-500'), tension: 0.4 },
          { label: 'Espacios Disponibles', data: response.data.available, borderColor: documentStyle.getPropertyValue('--green-500'), tension: 0.4 }
        ]
      };
    });
  }

}
