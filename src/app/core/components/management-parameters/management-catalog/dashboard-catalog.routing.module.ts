import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardCatalogComponent } from './dashboard-catalog.component';

const routes: Routes = [
    { path: '', component: DashboardCatalogComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardCatalogRoutingModule { }
