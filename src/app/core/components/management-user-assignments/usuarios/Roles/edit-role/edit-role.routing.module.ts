import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditRoleComponent } from './edit-role.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EditRoleComponent }
    ])],
    exports: [RouterModule]
})
export class EditRoleRoutingModule { }
