import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Assignments, GetEmployee, Tag } from 'src/app/core/api/assignment/assignment.model';
import { AllAssignments } from '../../api/all-locatiions/location.model';
import { ApiUrlService } from '../apiUrl/api-url.service';


@Injectable({
    providedIn: 'root'
})
export class AssignmentsService {

    //private apiUrl = 'http://localhost:3500/api/v1/assignment/employee/';
    //  private apiUrlAssignments = 'http://localhost:3500/api/v1/assignment/';
    //private apiUrlTags = 'http://localhost:3500/api/v1/parameter/tag';
    // private apiUrlSlots = 'http://localhost:3500/api/v1/parking/location/available-slots/';


    private apiUrl: string;
    private apiUrlAssignments: string;
    private apiUrlTags: string;
    private apiUrlSlots: string;

    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.apiUrl = this.apiUrlService.apiAssignmentsEmployeeData();
        this.apiUrlAssignments = this.apiUrlService.apiAssignmentsData();
        this.apiUrlTags = this.apiUrlService.apiTagParameterData();
        this.apiUrlSlots = this.apiUrlService.apiAssignmentsSlotData();

    }

    //GET EMPLOYEE BY ID
    getEmployeeById(id: number): Observable<any> {

        return this.http.get<GetEmployee>(`${this.apiUrl}${id}`).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Client-side errors
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side errors
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => new Error('Código no Valido'))
    }
    // END GET EMPLOYEE BY ID


    //GET ALL ASSIGNMENTS
    getAllAssignments(limit: number, page: number): Observable<AllAssignments> {

        return this.http.get<AllAssignments>(`${this.apiUrlAssignments}?limit=${limit}&page=${page}`);
    }



    // END GET ALL ASSIGNMENTS

    /**
      //POST ASSIGNMENTS assignment
      createAssignment(data: any): Observable<any> {
        return this.http.post(this.apiUrl, data);
      }
    */


    //FORM ASSINMENTS
    getAssignments(): Observable<any> {
        return this.http.get(this.apiUrlAssignments);
    }

    createAssignment(assignment: Assignments): Observable<Assignments> {
        return this.http.post<Assignments>(this.apiUrlAssignments, assignment);
    }

    updateAssignment(id: string, data: any): Observable<any> {
        return this.http.put(`${this.apiUrlAssignments}/${id}`, data);
    }

    deleteAssignment(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrlAssignments}/${id}`);
    }
    //END FORM ASSINMENTS


    //Get all tags
    getAllTags(limit: number, page: number): Observable<any> {
        return this.http.get<Tag>(`${this.apiUrlTags}?limit=${limit}&page=${page}`);
    }
    //End Get all tags


    //Get Available slots
    getAvailableSlots(locationId: string, vehicleType: string): Observable<any> {
        let params = new HttpParams();
        //params = params.append('locationId', locationId);
        params = params.append('vehicleType', vehicleType);

        return this.http.get<any>(`${this.apiUrlSlots}${locationId}`, { params });
    }


    /**
    getAvailableSlots(locationId: string, vehicleType: string): Observable<any> {
        let params = new HttpParams( )
          .set('locationId', locationId)
          .set('vehicleType', vehicleType);
        return this.http.get<any>(this.apiUrlSlots, { params });
      }
    */

    /**
      getAvailableSlots(locationId: string, vehicleType: string): Observable<any> {
        const body = {
          locationId: locationId,
          vehicleType: vehicleType
        };
        return this.http.post<any>(this.apiUrlSlots, body);
      }
        */

    //End Available slots

}
