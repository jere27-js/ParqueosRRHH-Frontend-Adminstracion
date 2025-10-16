import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateParkingComponent } from './create-parking.component';
import {CreateParkingRoutingModule} from './create-parking-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';

import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';





@NgModule({
    imports: [
        CommonModule,
        CreateParkingRoutingModule,
        FormsModule,
		TableModule,
		RatingModule,
		ButtonModule,
		SliderModule,
		InputTextModule,
		ToggleButtonModule,
		RippleModule,
		MultiSelectModule,
		DropdownModule,
		ProgressBarModule,
		ToastModule,
        AutoCompleteModule,
        CalendarModule,
        ChipsModule,
        InputMaskModule,
        InputNumberModule,
        CascadeSelectModule,
        InputTextareaModule,
        ReactiveFormsModule,
        ConfirmPopupModule,
        MatPaginatorModule,
        MatTableModule,
        HttpClientModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        DialogModule


    ],
    declarations: [CreateParkingComponent],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class CreateParkingModule { }
