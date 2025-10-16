import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { Setting } from 'src/app/core/api/setting';
import { SettingService } from 'src/app/core/service/setting.service';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-setting',
    standalone: false,
    templateUrl: './setting.component.html',
    providers: [MessageService, TableModule, TagModule, RatingModule, ButtonModule, CommonModule, ConfirmationService, ToastModule]

})
export class SettingComponent implements OnInit {

    settings: Setting[] = [];

    setting: Setting = {};
    cols: any[] = [];

    statuses!: SelectItem[];

    clonedSettings: { [s: string]: Setting } = {};

    constructor(private messageService: MessageService, private settingService: SettingService, private confirmationService: ConfirmationService) { }

    ngOnInit() {


        this.settingService.getSetting().then((data) => {
            this.settings = data;
        });

        this.statuses = [
            { label: 'In Stock', value: 'INSTOCK' },
            { label: 'Low Stock', value: 'LOWSTOCK' },
            { label: 'Out of Stock', value: 'OUTOFSTOCK' }
        ];

        this.cols = [
            { field: 'settingKey', header: 'settingKey' },
            { field: 'settingValue', header: 'settingValue' },
            { field: 'description', header: 'description' },
            { field: 'actions', header: 'Actions' }
        ];


    }

    getSeverity(statuses: string) {
        switch (statuses) {
            case 'INSTOCK':
                return 'success';
            case 'LOWSTOCK':
                return 'warning';
            case 'OUTOFSTOCK':
                return 'danger';
            default:
                return 'unknown';
        }
    }

    onRowEditInit(setting: Setting) {
        this.clonedSettings[setting.id as string] = JSON.parse(JSON.stringify(setting));
    }


    onRowEditSave(setting: Setting) {
        const trimmedValue = setting.settingValue?.toString().trim();

        if (!trimmedValue || trimmedValue === "") {
            this.revertSetting(setting);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ha ingresado un valor vacío o inválido',
            });
            return;
        }

        if (setting.settingKey === 'MAX_DAYS_TO_ASSIGNMENT_LOAN') {
            const numericValue = Number(trimmedValue);

            if (isNaN(numericValue) || numericValue < 1 || numericValue > 100) {
                this.revertSetting(setting);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Valor inválido',
                    detail: 'El valor debe ser un número entre 1 y 100',
                });
                return;
            }

            setting.settingValue = numericValue.toString();
        }

        if (setting.settingKey === 'MAX_MONT') {
            const numericValue = Number(trimmedValue);
            if (isNaN(numericValue) || numericValue < 1 || numericValue > 2000) {
                this.revertSetting(setting);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Valor inválido',
                    detail: 'El valor debe ser un número entre 1 y 2000',
                });
                return;
            }

            setting.settingValue = numericValue.toString();
        }

        if (setting.settingKey === 'MAX_ASSIGNMENT') {
            const numericValue = Number(trimmedValue);
            if (isNaN(numericValue) || numericValue < 1 || numericValue > 100) {
                this.revertSetting(setting);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Valor inválido',
                    detail: 'El valor debe ser un número entre 1 y 100',
                });
                return;
            }

            setting.settingValue = numericValue.toString();
        }

        if (setting.settingKey === 'SLOTS_GENERATE') {
            const numericValue = Number(trimmedValue);
            if (isNaN(numericValue) || numericValue < 1 || numericValue > 150) {
                this.revertSetting(setting);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Valor inválido',
                    detail: 'El valor debe ser un número entre 1 y 150',
                });
                return;
            }

            setting.settingValue = numericValue.toString();
        }

        this.settingService.patchSetting(setting.id as string, setting.settingValue, setting.description).subscribe(
            response => {
                delete this.clonedSettings[setting.id as string];
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'El valor ha sido editado',
                });
            },
            error => {
                this.revertSetting(setting);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo actualizar el valor',
                });
            }
        );
    }




    revertSetting(setting: Setting) {
        const original = this.clonedSettings[setting.id as string];
        if (original) {
            Object.assign(setting, original);
        }
    }



    onRowEditCancel(setting: Setting, index: number) {
        const clonedSetting = this.clonedSettings[setting.id as string];
        if (clonedSetting) {
            this.settings[index] = clonedSetting;
            delete this.clonedSettings[setting.id as string];
        } else {
            console.error(`No cloned setting found for id: ${setting.id}`);
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        const inputValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        table.filterGlobal(inputValue, 'contains');
    }

    confirm(event: Event, setting: Setting) {
        this.confirmationService.confirm({
            key: 'confirm',
            target: event.target || new EventTarget(),
            message: '¿Estás seguro de que quieres cambiar el valor del campo? Toma en cuenta que esto puede afectar el funcionamiento del sistema',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.onRowEditSave(setting);
            },
            reject: () => {
                const index = this.settings.findIndex(settingItem => settingItem.id === setting.id);
                if (index !== -1) {
                    this.onRowEditCancel(setting, index);
                } else {
                    console.error('Elemento no encontrado en la lista de configuraciones.');
                }
                this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Has cancelado la acción' });
            }
        });
    }


}
