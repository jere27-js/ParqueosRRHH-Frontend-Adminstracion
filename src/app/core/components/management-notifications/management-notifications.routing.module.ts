import { DashboardModule } from './../dashboard/dashboard.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';




@NgModule({
    imports: [RouterModule.forChild([
        { path: 'dashboard-notifications', loadChildren: () => import('./dashboard-notifications/dashboard-notifications.module').then(m => m.DashboardNotificationsModule) },
        { path: 'create-notifications', loadChildren: () => import('./create-notifications/create-notifications.module').then(m => m.CreateNotificationsModule) },

        { path: '**', redirectTo: '/notfound' }
    ])],

})
export class ManagementNotificationsRoutingModule { }
