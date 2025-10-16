import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateAcceptanceForm } from 'src/app/core/api/create-acceptance-form/createAcceptanceForm.model';
import { UpdateStatusForm } from 'src/app/core/api/create-acceptance-form/updateStatusForm.model';
import { ApiUrlService } from '../apiUrl/api-url.service';

@Injectable({
    providedIn: 'root'
})
export class CreateAcceptanceFormService {

    //private apiUrl = 'http://localhost:3500/api/v1/assignment/acceptance';

    private apiUrl: string;
    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.apiUrl = this.apiUrlService.apiAcceptanceData();
    }

    //POST
    createForm(assignment_id: string, body: CreateAcceptanceForm): Observable<any> {
        return this.http.post(`${this.apiUrl}/${assignment_id}`, body);
    }

    //PATCH
    patchStatusForm(assignment_id: string, body: UpdateStatusForm): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${assignment_id}`, body);
    }


}
