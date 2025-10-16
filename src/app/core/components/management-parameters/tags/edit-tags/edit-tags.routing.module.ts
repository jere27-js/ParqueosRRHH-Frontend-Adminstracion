import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditTagsComponent } from './edit-tags.component';


const routes: Routes = [
    { path: '', component: EditTagsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditTagsRoutingModule { }
