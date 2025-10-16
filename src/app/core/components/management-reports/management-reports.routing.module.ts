import { ReportsModule } from './dashboard-reports/reports.module';
import { ManagementReportsModule } from './management-reports.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';




@NgModule({
    imports: [RouterModule.forChild([
        { path: 'reports', loadChildren: () => import('./dashboard-reports/reports.module').then(m => m.ReportsModule) },

    ])],

})
export class ManagementReportsRoutingModule { }
