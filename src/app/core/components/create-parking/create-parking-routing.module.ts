import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateParkingComponent } from './create-parking.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: CreateParkingComponent }
    ])],
    exports: [RouterModule]
})
export class CreateParkingRoutingModule { }
