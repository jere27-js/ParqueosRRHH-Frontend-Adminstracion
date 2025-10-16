import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';



import { EditUserComponent } from './edit-user.component';



@NgModule({
	imports: [RouterModule.forChild([
		{ path: '',component: EditUserComponent},
	])],
	exports: [RouterModule]
})
export class EditUserRoutingModule { }
