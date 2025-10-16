import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingComponent } from './setting.component';



@NgModule({
	imports: [RouterModule.forChild([
		{ path: '',component: SettingComponent},
	])],
	exports: [RouterModule]
})
export class SettingRoutingModule { }
