import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleData, Role, RoleResponse, StatusCatalog } from 'src/app/core/api/role';
import { ApiUrlService } from './apiUrl/api-url.service';

@Injectable({
    providedIn: 'root'
})
export class RolService {


    //private apiUrl = 'http://localhost:3500/api/v1/parameter/roles';
    // private url = 'http://localhost:3500/api/v1/parameter/roles/resources';
    private roleId: string;
    private API_URL: string;
    private ROLE_API_URL: string;
    private headers: HttpHeaders;
    private apiStatus: string;

    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.API_URL = this.apiUrlService.apiRoleResourceData();
        this.ROLE_API_URL = this.apiUrlService.apiRolesParameterData();
        this.apiStatus = this.apiUrlService.apiCatalogStatusData();
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    sendParkingData(roleData: RoleData): Observable<any> {
        return this.http.post<any>(this.ROLE_API_URL, roleData, { headers: this.headers });
    }

    getAccessData(): Observable<any> {
        return this.http.get<any>(this.API_URL);
    }

    createRole(data: any): Observable<any> {
        return this.http.post(this.ROLE_API_URL, data, { headers: this.headers });
    }

    getRolData(limit: number, page: number): Observable<{ data: Role[], pageCounter: number }> {
        return this.http.get<{ data: Role[], pageCounter: number }>(
            `${this.ROLE_API_URL}?limit=${limit}&page=${page}`
        );
    }

    getRole(id: string): Observable<any> {
        const url = `${this.ROLE_API_URL}/${id}`;
        return this.http.get(url, { headers: this.headers });
    }

    deleteRole(id: string): Observable<void> {
        const url = `${this.ROLE_API_URL}/${id}`;
        return this.http.delete<void>(url, { headers: this.headers });
    }

    setRoleId(id: string): void {
        this.roleId = id;
    }

    getRoleId(): string {
        return this.roleId;
    }

    updateRole(roleId: string, updatedData: any): Observable<any> {
        const url = `${this.ROLE_API_URL}/${roleId}`;
        return this.http.put(url, updatedData, { headers: this.headers });
    }

    getStatusCatalog(): Observable<StatusCatalog> {
        return this.http.get<StatusCatalog>(this.apiStatus);
    }

}
