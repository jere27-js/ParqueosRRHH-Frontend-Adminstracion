import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcceptanceForm } from '../../api/acceptance-form/acceptanceForm.model';
import { ApiUrlService } from '../apiUrl/api-url.service';
@Injectable({
    providedIn: 'root'
})
export class AcceptanceService {
    // private apiUrl = 'http://localhost:3500/api/v1/assignment/acceptance';
    private localStorageKey = 'assignmentData';

    private apiUrl: string;
    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.apiUrl = this.apiUrlService.apiAcceptanceData();
    }

    getAcceptanceData(assignmentId: string): Observable<AcceptanceForm> {
        return this.http.get<AcceptanceForm>(`${this.apiUrl}/${assignmentId}/data`);
    }

    saveAssignmentData(data: any): void {
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
    }

    loadAssignmentData(): any {
        const data = localStorage.getItem(this.localStorageKey);
        return data ? JSON.parse(data) : null;
    }
}
