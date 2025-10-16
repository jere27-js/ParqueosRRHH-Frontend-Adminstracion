import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UpdateStatusDiscountNote } from '../../api/discount-note/updateStatusDiscountNote.model';
import { ApiUrlService } from '../apiUrl/api-url.service';


@Injectable({
    providedIn: 'root'
})
export class DiscountNoteService {
    //private apiUrl = 'http://localhost:3500/api/v1/assignment/discount-note/notification';
    //private apiUrlnote = 'http://localhost:3500/api/v1/assignment/discount-note';

    private apiUrl: string;
    private apiUrlnote: string;

    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.apiUrl = this.apiUrlService.apiDiscountNoteNotifications();
        this.apiUrlnote = this.apiUrlService.apiDiscountNoteData();
    }

    //POST null no para no enviar un body
    createNotification(discount_note_id: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${discount_note_id}`, null);
    }


    /**
    createNotification(discount_note_id: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/${discount_note_id}`, null).pipe(
          catchError(error => {
            if (error.status === 400) {
              // Manejar el error 400 aquí
              console.error('Error 400: Solicitud incorrecta');
              // Puedes mostrar una notificación al usuario en lugar de registrar en la consola
              // this.notificationService.show('Error 400: Solicitud incorrecta');
            }
            // Retornar un observable con un error para que la aplicación pueda manejarlo
            return throwError(() => new Error(error.message));
          })
        );
      }
    */

    //PATCH
    updateStatusDiscountNote(discount_note_id: string, body: UpdateStatusDiscountNote): Observable<any> {
        return this.http.patch(`${this.apiUrlnote}/${discount_note_id}`, body);
    }
}
