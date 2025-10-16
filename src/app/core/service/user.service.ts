import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { UserData, User, UserResponse, Role, RoleResponse } from 'src/app/core/api/user';
import { ApiUrlService } from './apiUrl/api-url.service';
import { StatusCatalog } from '../api/role';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    //private url = 'http://localhost:3500/api/v1/parameter/users';
    //private apiUrl = 'http://localhost:3500/api/v1/parameter/roles';

    private userId: string;
    private API_URL: string;
    private ROLE_API_URL: string;
    private headers: HttpHeaders;
    private apiStatus: string;

    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.API_URL = this.apiUrlService.apiUserParameterData();
        this.ROLE_API_URL = this.apiUrlService.apiRolesParameterData();
        this.apiStatus = this.apiUrlService.apiCatalogStatusData();
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    getAccessData(): Observable<any> {
        return this.http.get<any>(this.API_URL);
    }

    sendUserData(userData: UserData): Observable<any> {
        return this.http.post<any>(this.API_URL, userData, { headers: this.headers });
    }

    createUser(data: any): Observable<any> {
        return this.http.post(this.API_URL, data, { headers: this.headers });
    }
    getUserData(limit: number, page: number): Observable<{ data: User[], pageCounter: number, total: number }> {
        return this.http.get<{ data: User[], pageCounter: number, total: number }>(
            `${this.API_URL}?limit=${limit}&page=${page}`
        );
    }

    getRolData(limit: number, page: number): Observable<{ data: Role[], pageCounter: number }> {
        return this.http.get<{ data: Role[], pageCounter: number }>(
            `${this.ROLE_API_URL}?limit=${limit}&page=${page}`
        );
    }

    getUser(id: string): Observable<any> {
        return this.http.get(`${this.API_URL}/${id}`);
    }

    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_URL}/${id}`);
    }

    setUserId(id: string): void {
        this.userId = id;
    }

    getUserId(): string {
        return this.userId;
    }

    updateUser(userId: string, updatedData: any): Observable<any> {
        return this.http.put(`${this.API_URL}/${userId}`, updatedData, { headers: this.headers });
    }
    getStatusCatalog(): Observable<StatusCatalog> {
        return this.http.get<StatusCatalog>(this.apiStatus);
    }
}
export { Role };
