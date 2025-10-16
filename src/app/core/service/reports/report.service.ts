import { Injectable } from '@angular/core';
import { EmployeeDetailCostReport, EmployeeReport, LocationReport, ParkingAssignedPeriodReport } from '../../api/reports/report.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from '../apiUrl/api-url.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

 constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {}


 getLocationReports(limit: number, page: number ): Observable<any> {
    const API_URL = this.apiUrlService.apiLocationReports();
    return this.http.get<any>(`${API_URL}?limit=${limit}&page=${page}`);
 }

 getEmployeeReports(limit: number, page: number ): Observable<any> {
    const API_URL = this.apiUrlService.apiEmployeeReport();
    return this.http.get<any>(`${API_URL}?limit=${limit}&page=${page}`);
}

getEmployeeDetailCostReport(limit: number, page: number ): Observable<any> {
    const API_URL = this.apiUrlService.apiDetailWithCostReport();
    return this.http.get<any>(`${API_URL}?limit=${limit}&page=${page}`);
}



getParkingAssignedPeriodReport(limit: number, page: number, startDate: string, endDate: string): Observable<any> {
    //const params = { limit: limit.toString(), page: page.toString(), startDate, endDate };
    const API_URL = this.apiUrlService.apiParkingAssignedPeriodReport();

    //return this.http.get<any>(API_URL, { params });
   // pi/v1/reports/assigned-parking-spots?limit=10&page=1&startDate=2025-01-10&endDate=2025-02-03
    return this.http.get<any>(`${API_URL}?limit=${limit}&page=${page}&startDate=${startDate}&endDate=${endDate}`);
  }


}
