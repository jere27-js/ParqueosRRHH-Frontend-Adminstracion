import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRoleComponent } from './create-role.component';


const routes: Routes = [
    { path: '', component: CreateRoleComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRoleRoutingModule { }
