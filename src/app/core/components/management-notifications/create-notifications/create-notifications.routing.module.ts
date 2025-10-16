import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNotificationsComponent } from './create-notifications.component';

const routes: Routes = [
    { path: '', component: CreateNotificationsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateNotificationsRoutingModule { }
