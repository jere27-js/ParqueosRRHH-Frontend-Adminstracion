import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardNotificationsComponent } from './dashboard-notifications.component';

const routes: Routes = [
    { path: '', component: DashboardNotificationsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardNotificationsRoutingModule { }
