import { Injectable } from '@angular/core';
import { AssignmentLoan } from '../../api/assignment/assignment-loan.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../apiUrl/api-url.service';

@Injectable({
    providedIn: 'root'
})
export class AssignmentLoanService {
    //private apiUrl = 'http://localhost:3500/api/v1/assignment';

    private apiUrl: string;
    private apiAssignments: string;

    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.apiUrl = this.apiUrlService.apiAssignmentsData();
        this.apiAssignments = this.apiUrlService.apiAssignmentsLoanData();

    }

    //POST
    createLoan(assignment_id: string, body: AssignmentLoan): Observable<any> {
        return this.http.post(`${this.apiUrl}/${assignment_id}/assignment-loan`, body);
    }

    //CRUD
    getAssignmentById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    updateAssignmentLoan(id: string, data: any): Observable<any> {
        return this.http.patch(`${this.apiAssignments}/${id}`, data);
    }

    deleteAssignmentLoan(id: string): Observable<any> {
        return this.http.delete(`${this.apiAssignments}/${id}`);
    }

}
