import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ParkingData, Parking, ParkingResponse } from 'src/app/core/api/parkings'
import { ApiUrlService } from './apiUrl/api-url.service';
import { SlotStatusCatalog, SlotTypeCatalog, StatusCatalog, VehicleTypeCatalog, BenefitTypeCatalog } from '../api/management-catalog/catalog';

@Injectable({
    providedIn: 'root'
})

export class ParkingService {

    //private apiUrl = 'http://localhost:3500/api/v1/parking/location';
    private apiStatus: string;
    private apiVehicleType: string;
    private apiBenefitType: string;
    private apiSlotType: string;
    private apiStatusSlot: string;

    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.apiStatus = this.apiUrlService.apiCatalogStatusData();
        this.apiVehicleType = this.apiUrlService.apiVehicleTypeData();
        this.apiBenefitType = this.apiUrlService.apiBenefitTypeData();
        this.apiSlotType = this.apiUrlService.apiSlotTypeData();
        this.apiStatusSlot = this.apiUrlService.apiStatusSlotData();

    }

    sendParkingData(parkingData: ParkingData): Observable<any> {
        const API_URL = this.apiUrlService.apiParkingLocationData();
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.post<any>(API_URL, parkingData, { headers });
    }

    getParkingData(limit: number, page: number): Promise<ParkingResponse> {
        const API_URL = this.apiUrlService.apiParkingLocationData();
        return firstValueFrom(
            this.http.get<ParkingResponse>(`${API_URL}?limit=${limit}&page=${page}`)
        );
    }


    deleteLocation(id: string): Observable<void> {
        const API_URL = `${this.apiUrlService.apiParkingLocationData()}/${id}`;
        return this.http.delete<void>(API_URL);
    }

    getLocation(id: string): Observable<any> {
        return this.http.get(`${this.apiUrlService.apiParkingLocationData()}/${id}`);
    }


    private parkingId: string;

    setParkingId(id: string) {
        this.parkingId = id;
    }

    getParkingId(): string {
        return this.parkingId;
    }


    updateLocation(parkingId: string, updatedData: any): Observable<any> {
        const API_URL = `${this.apiUrlService.apiParkingLocationData()}/${parkingId}`;
        return this.http.put(API_URL, updatedData);
    }
    getStatusCatalog(): Observable<StatusCatalog> {
        return this.http.get<StatusCatalog>(this.apiStatus);
    }
    getVehicleTypeCatalog(): Observable<VehicleTypeCatalog> {
        return this.http.get<VehicleTypeCatalog>(this.apiVehicleType);
    }
    getBenefitTypeCatalog(): Observable<BenefitTypeCatalog> {
        return this.http.get<BenefitTypeCatalog>(this.apiBenefitType);
    }

    getSlotTypeCatalog(): Observable<SlotTypeCatalog> {
        return this.http.get<SlotTypeCatalog>(this.apiSlotType);
    }


    getSlotStatusCatalog(): Observable<SlotStatusCatalog> {
        return this.http.get<SlotStatusCatalog>(this.apiStatusSlot);
    }
}


