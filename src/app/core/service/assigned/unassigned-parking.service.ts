import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnassignedParking } from '../../api/create-acceptance-form/unassignedParking.model';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../apiUrl/api-url.service';

@Injectable({
    providedIn: 'root'
})
export class UnassignedParkingService {

    //private apiUrl = 'http://localhost:3500/api/v1/assignment';

    private apiUrl: string;

    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.apiUrl = this.apiUrlService.apiAssignmentsData();
    }

    //POST
    UnassignedParking(assignmentId: string, body: UnassignedParking): Observable<any> {
        return this.http.post(`${this.apiUrl}/${assignmentId}/de-assignment`, body);
    }


}
