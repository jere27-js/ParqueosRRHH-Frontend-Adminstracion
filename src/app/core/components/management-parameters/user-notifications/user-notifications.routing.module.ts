import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserNotificationsComponent } from './user-notifications.component';



@NgModule({
	imports: [RouterModule.forChild([
		{ path: '',component: UserNotificationsComponent},
	])],
	exports: [RouterModule]
})
export class UserNotificationsRoutingModule { }
