import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CrudComponent } from './crud.component';
import { ViewParkingComponent } from './view-parking/view-parking.component';
import { AuthGuard } from '../../guards/auth.guard';



@NgModule({
	imports: [RouterModule.forChild([
		{ path: '',component: CrudComponent},
        {path: '',component: ViewParkingComponent},

        { path: 'create-parking',
                        loadChildren: () => import('../create-parking/create-parking.module').then(m => m.CreateParkingModule),
                        canActivate: [AuthGuard]
        },
        { path: 'view-parking',
        loadChildren: () => import('../parking-crud/view-parking/view-parking.module').then(m=> m.ViewParkingModule),
        canActivate: [AuthGuard]
        },
        { path: 'edit-parking',
        loadChildren: () => import('../edit-parking/emptydemo.module').then(m => m.EmptyDemoModule),
        canActivate: [AuthGuard]
        },



	])],
	exports: [RouterModule]
})
export class CrudRoutingModule { }
