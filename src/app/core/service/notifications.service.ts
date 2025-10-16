import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

import { User, notificationsPreferences } from '../api/notifications';
import { ApiUrlService } from './apiUrl/api-url.service';

@Injectable({
    providedIn: 'root',
})
export class NotificationsService {
    //private url =  'http://localhost:3500/api/v1/parameter/notifications/preferences';
    private API_URL: string;
    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.API_URL = this.apiUrlService.apiNotificationParameterData();
    }

    getUserPreferences(userId: string): Observable<User> {
        const urlWithUserId = `${this.API_URL}/${userId}`;
       // console.log(urlWithUserId);
        return this.http
            .get<{
                data: {
                    id: string;
                    username: string;
                    email: string;
                    name: string;
                    notificationPreferences: any[];
                };
            }>(urlWithUserId)
            .pipe(
                //tap(() => console.log('User ID:', userId)),
                map((response) => response.data) // obtenemos el objeto data
            );
    }

    updateUserPreferences(userId: string, preferences: any): Observable<any> {
        const updateUrl = `${this.API_URL}/${userId}`;
        return this.http.put(updateUrl, preferences);
    }
}
