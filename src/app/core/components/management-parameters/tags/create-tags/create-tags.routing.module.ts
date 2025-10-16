import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateTagsComponent } from './create-tags.component';


const routes: Routes = [
    { path: '', component: CreateTagsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateTagsRoutingModule { }
