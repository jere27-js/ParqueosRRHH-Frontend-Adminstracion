import { Injectable } from '@angular/core';
import { ApiUrlService } from '../apiUrl/api-url.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OverviewService {

  constructor(private http: HttpClient, private apiUrlService: ApiUrlService) { }

getStatusOverviewData(): Observable<any> {
    const API_URL = this.apiUrlService.apiStatusOverviewData();
    return this.http.get<any>(API_URL);
}

getParkingAvailability(): Observable<any> {
    const API_URL2 = this.apiUrlService.apiParkingAvailability();
    return this.http.get<any>(API_URL2);
  }

  getEmployeesParking(): Observable<any> {
    const API_URL3 = this.apiUrlService.apiParkingAvailabilityEmployee();
    return this.http.get<any>(API_URL3);
  }


}
