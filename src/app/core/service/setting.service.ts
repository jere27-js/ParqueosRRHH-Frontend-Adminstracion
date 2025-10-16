import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Setting } from '../api/setting';
import { Observable, tap } from 'rxjs';
import { ApiUrlService } from './apiUrl/api-url.service';

@Injectable({
    providedIn: 'root'
})
export class SettingService {

    // private apiUrl = 'http://localhost:3500/api/v1/parameter/settings';
    private API_URL: string;

    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.API_URL = this.apiUrlService.apiSettingParameterData();
    }
    getSetting() {
        return this.http.get<any>(this.API_URL).pipe()
            .toPromise()
            .then(res => res.data as Setting[])
            .then(data => data);
    }

    patchSetting(id: string, settingValue: string, description: string): Observable<any> {
        const body = { settingValue, description };
        return this.http.patch(`${this.API_URL}/${id}`, body);
    }

}
