import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup } from '@angular/forms';
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
import { InputSwitchModule } from 'primeng/inputswitch';
import { MatSelectModule } from '@angular/material/select';
import { TagModule } from 'primeng/tag';
import { ReportsRoutingModule } from './reports.routing.module';
import { ReportsComponent } from './reports.component';
import { Table } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
    imports: [
        CommonModule,
        ReportsRoutingModule,
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
        ReactiveFormsModule,
        DividerModule,
        CheckboxModule,
        ConfirmDialogModule,
        TagModule,
        InputSwitchModule,
        MatSelectModule,
        TableModule,
        CalendarModule,
    ],
    declarations: [ReportsComponent]
})
export class ReportsModule { }
