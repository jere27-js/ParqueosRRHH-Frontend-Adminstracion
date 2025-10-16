import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditTagsComponent } from './edit-tags.component';
import {EditTagsRoutingModule  } from './edit-tags.routing.module';
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
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';




@NgModule({
  declarations: [EditTagsComponent],
  imports: [
    CommonModule,
    MessageModule,
    EditTagsRoutingModule,
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
    MessageModule,
    CardModule
  ]

})
export class EditTagsModule { }
