import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AssignParkingComponent } from './assign-parking.component';
import { AssignmentFormComponent } from './assignment-form/assignment-form.component';
import { AcceptanceFormComponent } from './acceptance-form/acceptance-form.component';
import { GuestFormComponent } from './guest-form/guest-form.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';


const routes: Routes = [
    { path: '',
        component: AssignParkingComponent,
          canActivate: [AuthGuard]
     },
    { path: 'assignment-form', component: AssignmentFormComponent },
    { path: 'acceptance-form', component: AcceptanceFormComponent },
    { path: 'guest-form', component: GuestFormComponent },
    { path: '', redirectTo: 'personal', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignParkingRoutingModule { }
