import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Template } from 'src/app/core/api/template';
import { TemplatesService } from 'src/app/core/service/templates.service';
import { CdkDragDrop, CdkDragStart, CdkDragEnd } from '@angular/cdk/drag-drop';
import { ViewChild } from '@angular/core';
@Component({
    selector: 'app-template',
    standalone: false,
    templateUrl: './template.component.html',
    styleUrls: ['./template.component.css'],
    providers: [MessageService, ConfirmationService]

})
export class TemplateComponent implements OnInit {

    templates: Template[] = [];
    formTemplate: FormGroup;
    text: string | undefined;
    emailEditor: any;
    availableParameters: { parameterName: string; parameterDescription: string }[] = [];
    messages: any;
    initialState: any;
    isUpdating: Boolean = false;

    @ViewChild('emailEditor') emailEditorRef!: ElementRef<HTMLDivElement>;
    constructor(
        private templatesService: TemplatesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.formTemplate = new FormGroup({
            selectedTemplate: new FormControl<Template | null>(null, [Validators.required]),
            subject: new FormControl(null, [Validators.required]),
            content: new FormControl(null, [Validators.required])
        });
    }

    ngOnInit(): void {
        this.fetchTemplateVariables();
        this.templatesService.getTemplates().subscribe({
            next: (response) => {
                this.templates = response.data.map(template => ({
                    label: template.templateName,
                    id: template.id,
                    subject: template.subject,
                    content: template.content,
                }));
                //console.log("Templates: ", this.templates);
                // Guardamos el estado inicial del formulario
                this.initialState = { ...this.formTemplate.value };
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al traer la información de la Base de Datos, revise su conexión',
                });
            }
        });

        // Cambios en el campo de plantilla seleccionada
        this.formTemplate.get('selectedTemplate')?.valueChanges.subscribe((selectedTemplate: Template | null) => {
            // Prevenir recursión infinita
            if (this.isUpdating) {
                return;
            }
            // evitar que patchValue dispare otra vez el valueChanges
            this.isUpdating = true;

            try {
                if (selectedTemplate) {
                    // Si se selecciona una plantilla, actualizamos los campos
                    this.formTemplate.patchValue({
                        subject: selectedTemplate.subject,
                        content: selectedTemplate.content
                    });

                    setTimeout(() => {
                        if (this.emailEditorRef?.nativeElement) {
                            this.emailEditorRef.nativeElement.innerHTML = selectedTemplate.content || '';
                        }
                    });

                } else {
                    // Si no se selecciona plantilla, limpiamos los campos
                    this.formTemplate.patchValue({
                        selectedTemplate: null,
                        subject: null,
                        content: null
                    });

                    if (this.emailEditorRef?.nativeElement) {
                        this.emailEditorRef.nativeElement.innerHTML = '';
                    }

                    // Restauramos el estado inicial
                    Object.keys(this.formTemplate.controls).forEach(controlName => {
                        const control = this.formTemplate.get(controlName);
                        if (control) {
                            control.markAsPristine();
                            control.markAsUntouched();
                        }
                    });
                }
            } finally {
                this.isUpdating = false;
            }
        });
    }

    emailContent: string = '';

    onDragStart(event: DragEvent, param: { parameterName: string; parameterDescription: string }): void {
        event.dataTransfer?.setData('text', param.parameterName);
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        const data = event.dataTransfer?.getData('text');
        if (data && this.emailEditor) {
            const editorElement = this.emailEditor.nativeElement.querySelector('textarea');
            if (editorElement) {
                const start = editorElement.selectionStart;
                const end = editorElement.selectionEnd;
                const value = editorElement.value;
                editorElement.value = value.substring(0, start) + data + value.substring(end);
                this.emailContent = editorElement.value;
            }
        }
    }

    fetchTemplateVariables(): void {
        this.templatesService.getTemplateVariables().subscribe(
            (data: any) => {
                this.availableParameters = data.data.map((item: any) => ({
                    parameterName: item.parameterName,
                    parameterDescription: item.parameterDescription
                }));
            },
            (error) => {
                console.error('Error fetching template variables:', error);
            }
        );
    }

    allowDrop(event: DragEvent) {
        event.preventDefault();
    }

    //Actualizar plantilla
    onSaveTemplate(): void {
        if (this.formTemplate.valid) {
            const formData = this.formTemplate.value;

            const templateData = {
                id: formData.selectedTemplate?.id,
                templateName: formData.selectedTemplate?.label,
                subject: formData.subject,
                content: formData.content
            };
            // Llama al servicio para actualizar la plantilla
            this.templatesService.saveTemplate(templateData).subscribe(
                (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Plantilla actualizada correctamente'
                    });

                    // Limpiar la plantilla
                    this.formTemplate.patchValue({
                        selectedTemplate: null
                    });

                    this.formTemplate.controls['selectedTemplate'].markAsPristine();
                    this.formTemplate.controls['selectedTemplate'].markAsUntouched();

                    this.ngOnInit();
                },
                (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al actualizar la plantilla'
                    });
                    console.error('Error al actualizar la plantilla:', error);
                }
            );
        } else {

            this.messageService.add({
                severity: 'warn',
                summary: 'Formulario inválido',
                detail: 'Por favor, complete todos los campos requeridos'
            });
        }
    }

    cancelAction(): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Cancelado',
            detail: 'Has cancelado la acción'
        });
    }

    confirmSave(): void {
        this.confirmationService.confirm({
            key: 'confirmDialog',
            message: '¿Estás seguro que deseas actualizar la plantilla?',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.onSaveTemplate();
            },
            reject: () => {
                this.cancelAction();
            }
        });
    }

    exec(command: string) {
        document.execCommand(command, false, '');
    }

    onEditorInput(event: Event) {
        const content = (event.target as HTMLDivElement).innerHTML;
        this.formTemplate.get('content')?.setValue(content, { emitEvent: false });
    }


}

