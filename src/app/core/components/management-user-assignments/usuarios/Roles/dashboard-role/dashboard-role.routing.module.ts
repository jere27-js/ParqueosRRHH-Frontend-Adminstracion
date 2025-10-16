import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardRoleComponent } from './dashboard-role.component';
import { EditRoleComponent } from '../edit-role/edit-role.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';



@NgModule({
	imports: [RouterModule.forChild([
		{ path: '',component: DashboardRoleComponent},
        {path: '', component: EditRoleComponent},

            { path: 'create-role',
                    loadChildren: ()  => import('../create-role/create-role.module').then(m => m.CreateRoleModule),
                    canActivate: [AuthGuard]
                },
            { path: 'edit-role',
                loadChildren: ()  => import('../edit-role/edit-role.module').then(m => m.EditRoleModule),
                canActivate: [AuthGuard]
            },


	])],
	exports: [RouterModule]
})
export class DashboardRoleRoutingModule { }
