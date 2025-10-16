import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateTagsComponent } from './create-tags.component';
import { CreateTagsRoutingModule } from './create-tags.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { HttpClientModule } from '@angular/common/http';
import { DividerModule } from 'primeng/divider';



@NgModule({
  declarations: [CreateTagsComponent],
  imports: [
    CommonModule,
    CreateTagsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    HttpClientModule,
    DividerModule
  ]
})
export class CreateTagsModule { }
