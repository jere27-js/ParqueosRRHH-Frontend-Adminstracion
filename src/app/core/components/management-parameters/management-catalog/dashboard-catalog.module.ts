import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DashboardCatalogComponent } from './dashboard-catalog.component';
import { DashboardCatalogRoutingModule } from './dashboard-catalog.routing.module';
import { MenubarModule } from 'primeng/menubar';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
  declarations: [DashboardCatalogComponent],
  imports: [
    CommonModule,
    DashboardCatalogRoutingModule,
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
    TableModule,
    CommonModule,
    DividerModule,
    CheckboxModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    MenubarModule,
    TooltipModule

  ]
})
export class DashboardCatalogModule { }
