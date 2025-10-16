import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { DashboardNotificationsComponent } from './dashboard-notifications.component';
import { DashboardNotificationsRoutingModule } from './dashboard-notifications.routing.module';
import { SharedModule } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputMaskModule } from 'primeng/inputmask';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputOtpModule } from 'primeng/inputotp';



@NgModule({
  declarations: [DashboardNotificationsComponent],
  imports: [
    CommonModule,
    DashboardNotificationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    DividerModule,
    DialogModule,
    SharedModule,
    TagModule,
    CalendarModule,
    RadioButtonModule,
    DropdownModule,
    MultiSelectModule,
    ReactiveFormsModule,
    ToggleButtonModule,
    InputIconModule,
    IconFieldModule, 
    FormsModule,
    InputMaskModule,
     InputSwitchModule,
     InputTextModule,
     InputTextareaModule,
     InputNumberModule,
     InputGroupModule,
     InputGroupAddonModule,
     InputOtpModule,
    

  ]
})
export class DashboardNotificationsModule { }
