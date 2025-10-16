import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardTagsComponent } from './dashboard-tags.component';
import {DashboardTagsRoutingModule  } from './dashboard-tags.routing.module';
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
import { TagModule } from 'primeng/tag';


@NgModule({
  declarations: [DashboardTagsComponent],
  imports: [
    CommonModule,
    DashboardTagsRoutingModule,
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
    TagModule
  ]
})
export class DashboardTagsModule { }
