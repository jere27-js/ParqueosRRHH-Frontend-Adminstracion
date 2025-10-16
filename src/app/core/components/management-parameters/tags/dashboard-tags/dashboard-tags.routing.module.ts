import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardTagsComponent } from './dashboard-tags.component';
import { EditTagsComponent } from '../edit-tags/edit-tags.component';


const routes: Routes = [
    { path: '', component: DashboardTagsComponent },
    {path: '', component: EditTagsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardTagsRoutingModule { }
