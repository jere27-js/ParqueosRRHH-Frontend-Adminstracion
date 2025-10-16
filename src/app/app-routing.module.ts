import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './core/guards/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                loadChildren: () => import('./core/components/auth/login/login.module').then(m => m.LoginModule)
            },
            {
                path: '',
                component: AppLayoutComponent,
                children: [
                    {
                        path: 'dashboard',
                        loadChildren: () => import('./core/components/dashboard/dashboard.module').then(m => m.DashboardModule),
                        canActivate: [AuthGuard] // Descomenta para proteger esta ruta
                    },
                    {
                        path: 'assign-parking',
                        loadChildren: () => import('./core/components/management-user-assignments/assign-parking/assign-parking.module').then(m => m.AssignParkingModule),
                        canActivate: [AuthGuard]
                    },
                    {
                        path: 'management-parameters',
                        loadChildren: () => import('./core/components/management-parameters/management-parameters.module').then(m => m.ManagementParametersModule),
                         canActivate: [AuthGuard]
                    },
                    {
                        path: 'management-reports',
                        loadChildren: () => import('./core/components/management-reports/management-reports.module').then(m => m.ManagementReportsModule),
                         canActivate: [AuthGuard]
                    },
                    {
                        path: 'management-notifications',
                        loadChildren: () => import('./core/components/management-notifications/management-notifications.module').then(m => m.ManagementNotificationsModule),
                         canActivate: [AuthGuard]
                    },
                    { path: 'parking-crud',
                        loadChildren: () => import('./core/components/parking-crud/crud.module').then(m => m.CrudModule),
                         canActivate: [AuthGuard]
                    },

                     {path: 'users',
                        loadChildren: () => import("./core/components/management-user-assignments/usuarios/users.module").then(m => m.UsersModule),
                        canActivate: [AuthGuard]
                    },
                ]
            },
            {
                path: 'auth',
                loadChildren: () => import('./core/components/auth/auth.module').then(m => m.AuthModule),
                canActivate: [AuthGuard]
            },
            {
                path: '**',
                redirectTo: '/auth/notfound'
            },
        ], {
            scrollPositionRestoration: 'enabled',
            anchorScrolling: 'enabled',
            onSameUrlNavigation: 'reload'
        })
    ],

    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
