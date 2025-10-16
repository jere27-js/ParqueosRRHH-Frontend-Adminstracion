import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isScheduledAll, isScheduledIndividual, isScheduledTags, NotificationAll, NotificationIndividual, NotificationTags, Tag, User, Notification } from '../../api/management-notifications/management-notifications';
import { ApiUrlService } from '../apiUrl/api-url.service';

@Injectable({
    providedIn: 'root'
})
export class ManagementNotificationsService {
    // private apiUrlTags = 'http://localhost:3500/api/v1/parameter/tag';
    //private baseUrl = 'http://localhost:3500/api/v1/notification';
    // private baseUrlAssignment = 'http://localhost:3500/api/v1/assignment';

    private apiUrlTags: string;
    private baseUrl: string;
    private baseUrlAssignment: string;
    private urlNotification: string;

    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.apiUrlTags = this.apiUrlService.apiTagParameterData();
        this.baseUrl = this.apiUrlService.apiNotificationDemandData();
        this.baseUrlAssignment = this.apiUrlService.apiAssignmentEmployeeData();
        this.urlNotification = this.apiUrlService.apiNotificationData();
    }

    // Obtener listado de tags
    getAllTag(limit: number, page: number): Observable<any> {
        return this.http.get<Tag>(`${this.apiUrlTags}?limit=${limit}&page=${page}`);
    }

    //Obtener los usuarios
    getAllUsers(limit: number, page: number): Observable<{ data: User[]; total: number }> {
        return this.http.get<{ data: User[]; total: number }>(
            `${this.baseUrlAssignment}?limit=${limit}&page=${page}`
        );
    }

    //obtener todas las notifications
    getAllNotifications(limit: number, page: number): Observable<{ data: Notification[]; total: number }> {
        return this.http.get<{ data: Notification[]; total: number }>(
            `${this.urlNotification}/?limit=${limit}&page=${page}`
        );
    }

    // Crear notificación individual
    sendNotificationIndividual(notificationData: NotificationIndividual): Observable<any> {
        return this.http.post<NotificationIndividual>(this.baseUrl, notificationData);
    }

    // Crear notificación por grupos
    sendNotificationTags(notificationData: NotificationTags): Observable<any> {
        return this.http.post<NotificationTags>(this.baseUrl, notificationData);
    }

    // Crear notificación para todos
    sendNotificationAll(notificationData: NotificationAll): Observable<any> {
        return this.http.post<NotificationAll>(this.baseUrl, notificationData);
    }

    //Scheduled Notification
    // Método para notificaciones individuales
    createScheduledIndividualNotification(notification: isScheduledIndividual): Observable<any> {
        return this.http.post(this.baseUrl, notification);
    }

    // Método para notificaciones basadas en grupos
    createScheduledTagsNotification(notification: isScheduledTags): Observable<any> {
        return this.http.post(this.baseUrl, notification);
    }

    // Método para notificaciones a todos
    createScheduledAllNotification(notification: isScheduledAll): Observable<any> {
        return this.http.post(this.baseUrl, notification);
    }

}
