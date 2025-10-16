import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TemplateComponent } from './template.component';


@NgModule({
	imports: [RouterModule.forChild([
		{ path: '',component: TemplateComponent},
	])],
	exports: [RouterModule]
})
export class TemplateRoutingModule { }
