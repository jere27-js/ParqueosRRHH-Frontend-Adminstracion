import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';


@NgModule({
    imports: [RouterModule.forChild([
        { path: 'timeline',
            loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule),
            canActivate: [AuthGuard]
        },

        { path: '**', redirectTo: '/notfound' }
    ])],

})
export class PagesRoutingModule { }
