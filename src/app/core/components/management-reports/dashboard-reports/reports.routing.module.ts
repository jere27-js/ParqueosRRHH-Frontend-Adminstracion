import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReportsComponent } from './reports.component';



@NgModule({
    imports: [RouterModule.forChild([
        { path: '',component: ReportsComponent},
    ])],
    exports: [RouterModule]
})
export class ReportsRoutingModule { }


