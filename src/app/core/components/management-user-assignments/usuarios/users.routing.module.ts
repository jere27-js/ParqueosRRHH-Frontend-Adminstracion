import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';




import { UsersComponent } from './users.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';



@NgModule({
	imports: [RouterModule.forChild([
		{ path: '',component: UsersComponent},
        {path: 'create-user',
                loadChildren: () => import("./create-user/create-user.module").then(m => m.CreateUserModule),
        },
        {path: 'edit-user',
                loadChildren: () => import("./edit-user/edit-user.module").then(m => m.EditUserModule),
        },
        {path: 'dashboard-role',
            loadChildren: () => import("./Roles/dashboard-role/dashboard-role.module").then(m => m.DashboardRoleModule),
    },


	])],
	exports: [RouterModule]
})
export class UsersRoutingModule { }
