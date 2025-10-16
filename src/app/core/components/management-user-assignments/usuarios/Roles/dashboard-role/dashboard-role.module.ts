import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoleRoutingModule } from './dashboard-role.routing.module';
import { DashboardRoleComponent } from './dashboard-role.component';


import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenuModule } from 'primeng/menu';
import { ReactiveFormsModule } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';





@NgModule({
  declarations: [DashboardRoleComponent],
  imports: [
    CommonModule,
    DashboardRoleRoutingModule,
    TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        ButtonModule,SplitButtonModule,
        ToggleButtonModule,
        MenuModule,
        ConfirmDialogModule,
        ReactiveFormsModule,
        DividerModule,
        CheckboxModule,
        RatingModule,
        TagModule,
        ButtonModule,
        CommonModule
  ]
})
export class DashboardRoleModule { }
