import { Component, OnInit } from '@angular/core';
import { OverviewService } from 'src/app/core/service/dashboar/overview.service';

@Component({
  selector: 'app-vertical-bar',
  templateUrl: './vertical-bar.component.html',
  styleUrl: './vertical-bar.component.scss'
})
export class VerticalBarComponent implements OnInit {
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
        x: { ticks: { color: textColorSecondary, font: { weight: 500 } }, grid: { color: surfaceBorder, drawBorder: false } },
        y: { ticks: { color: textColorSecondary }, grid: { color: surfaceBorder, drawBorder: false } }
      }
    };

    this.loadChartData();
  }

  loadChartData() {
    this.overviewService.getEmployeesParking().subscribe(response => {
      this.data = {
        labels: response.data.months,
        datasets: [
          {
            label: 'Colaboradores',
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--cyan-500'),
            data: response.data.employees
          },
          {
            label: 'Espacios',
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--red-500'),
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--red-500'),
            data: response.data.slots
          }
        ]
      };
    });
  }
}
