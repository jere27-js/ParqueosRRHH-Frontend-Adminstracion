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
import { CreateNotificationsComponent } from './create-notifications.component';
import { CreateNotificationsRoutingModule } from './create-notifications.routing.module';
import { SharedModule } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MultiSelectModule } from 'primeng/multiselect';
@NgModule({
  declarations: [CreateNotificationsComponent],
  imports: [
    CommonModule,
    CreateNotificationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    ToolbarModule,
    TableModule,
    DividerModule,
    DialogModule,
    FormsModule,
    SharedModule,
    InputSwitchModule,
    CalendarModule,
    RadioButtonModule,
    DropdownModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,

  ]
})
export class CreateNotificationsModule { }
