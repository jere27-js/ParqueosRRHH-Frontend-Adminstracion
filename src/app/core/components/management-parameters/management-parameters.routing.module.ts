import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';




@NgModule({
    imports: [RouterModule.forChild([
        { path: 'setting', loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule) },
        { path: 'user-notifications', loadChildren: () => import('./user-notifications/user-notifications.module').then(m => m.UserNotificationsModule) },
        {path: 'template', loadChildren:() => import ('./template/template.module').then(m => m.TemplateModule)},
        { path: 'create-tags', loadChildren: () => import('./tags/create-tags/create-tags.module').then(m => m.CreateTagsModule) },
        { path: 'edit-tags', loadChildren: () => import('./tags/edit-tags/edit-tags.module').then(m => m.EditTagsModule) },
        { path: 'dashboard-tags', loadChildren: () => import('./tags/dashboard-tags/dashboard-tags.module').then(m => m.DashboardTagsModule) },
        { path: 'dashboard-catalog', loadChildren: () => import('./management-catalog/dashboard-catalog.module').then(m => m.DashboardCatalogModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],

})
export class ManagementParametersRoutingModule { }
