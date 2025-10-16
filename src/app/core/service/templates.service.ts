import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ApiUrlService } from './apiUrl/api-url.service';

@Injectable({
    providedIn: 'root'
})
export class TemplatesService {
    //private url = 'http://localhost:3500/api/v1/parameter/template';
    //private apiUrl = 'http://localhost:3500/api/v1/parameter/template/variables';
    private API_URL: string;
    private TEMPLATE_API_URL: string;

    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.API_URL = this.apiUrlService.apiTemplateParameterData();
        this.TEMPLATE_API_URL = this.apiUrlService.apiTemplateVariablesData();
    }

    getTemplates(): Observable<any> {
        return this.http.get<any>(this.API_URL);
    }

    getTemplateVariables(): Observable<string[]> {
        return this.http.get<string[]>(this.TEMPLATE_API_URL);
    }

    saveTemplate(templateData: any): Observable<any> {
        if (!templateData.id) {
            return throwError(() => new Error('El ID es obligatorio para guardar la plantilla.'));
        }
        return this.http.put(`${this.API_URL}/${templateData.id}`, templateData);
    }

}
