import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AllLocations } from '../../api/all-locatiions/location.model';
import { ApiUrlService } from '../apiUrl/api-url.service';


@Injectable({
    providedIn: 'root'
})
export class GetAllLocationsService {


    // MI PAGINADO

    // private apiUrl = 'http://localhost:3500/api/v1/parking/location';

    private apiUrl: string;

    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.apiUrl = this.apiUrlService.apiParkingLocationData();
    }


    getAllLocations(limit: number, page: number): Observable<any> {
        //let params = new HttpParams()
        //  .set('limit', limit.toString())
        //  .set('page', page.toString());

        return this.http.get<AllLocations>(`${this.apiUrl}?limit=${limit}&page=${page}`);
    }


    getEmployeeById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }


}

