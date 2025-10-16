import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Tags, TagResponse } from '../../api/tags/tags';
import { ApiUrlService } from '../apiUrl/api-url.service';
import { StatusCatalog } from '../../api/management-catalog/catalog';
@Injectable({
    providedIn: 'root'
})
export class TagsService {

    // private baseUrl = 'http://localhost:3500/api/v1/parameter/tag';
    tagsId: string;
    private API_URL: string;
    private headers: HttpHeaders;
    private apiStatus: string;

    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.API_URL = this.apiUrlService.apiTagParameterData();
        this.apiStatus = this.apiUrlService.apiCatalogStatusData();

        this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    createTag(data: Tags): Observable<Tags> {
        return this.http.post<Tags>(this.API_URL, data, { headers: this.headers });
    }


    getTagsData(limit: number, page: number): Observable<TagResponse> {
        const url = `${this.API_URL}?limit=${limit}&page=${page}`;
        return this.http.get<TagResponse>(url);
    }


    deleteTags(id: string): Observable<void> {
        const url = `${this.API_URL}/${id}`;
        return this.http.delete<void>(url);
    }

    updateTags(tagsId: string, updatedData: Partial<Tags>): Observable<Tags> {
        if (!tagsId) {
            return throwError(() => new Error("El ID es inválido o no está presente."));
        }
        const url = `${this.API_URL}/${tagsId}`;
        return this.http.put<Tags>(url, updatedData);
    }


    setTagsId(id: string) {
        this.tagsId = id;
    }

    getTagsId(): string {
        return this.tagsId;
    }

    getTags(id: string): Observable<any> {
        return this.http.get<Tags>(`${this.API_URL}/${id}`);
    }

    getStatusCatalog(): Observable<StatusCatalog> {
        return this.http.get<StatusCatalog>(this.apiStatus);
    }
}








