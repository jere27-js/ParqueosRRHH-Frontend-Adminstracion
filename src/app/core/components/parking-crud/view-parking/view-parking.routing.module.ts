import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewParkingComponent } from './view-parking.component';

const routes: Routes = [
    { path: '', component: ViewParkingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewParkingRoutingModule { }
