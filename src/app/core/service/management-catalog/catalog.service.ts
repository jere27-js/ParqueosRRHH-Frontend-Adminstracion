import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    StatusItem, StatusCatalog, CreateStatus, BenefitTypeCatalog, CatalogBenefitType, CreateBenefitType
    , CreateVehicle, CatalogVehicleType, VehicleTypeCatalog, CreateSlotType, CatalogSlotType, SlotTypeCatalog, CreateSlotStatus,
    CatalogSlotStatus, SlotStatusCatalog
} from '../../../core/api/management-catalog/catalog';
import { ApiUrlService } from '../apiUrl/api-url.service';

@Injectable({
    providedIn: 'root'
})

export class CatalogService {

    /* private apiStatus = 'http://localhost:3500/api/v1/parameters/catalogs/status-types';
     private apiBenefitType = 'http://localhost:3500/api/v1/parameters/catalogs/benefit-types';
     private apiSlotType = 'http://localhost:3500/api/v1/parameters/catalogs/slot-types';
     private apiVehicleType = 'http://localhost:3500/api/v1/parameters/catalogs/vehicle-types';
     private apiStatusSlot = 'http://localhost:3500/api/v1/parameters/catalogs/status-slot-types';*/

    private apiStatus: string;
    private apiBenefitType: string;
    private apiSlotType: string;
    private apiVehicleType: string;
    private apiStatusSlot: string;

    constructor(private http: HttpClient, private apiUrlService: ApiUrlService) {
        this.apiStatus = this.apiUrlService.apiCatalogStatusData();
        this.apiBenefitType = this.apiUrlService.apiBenefitTypeData();
        this.apiSlotType = this.apiUrlService.apiSlotTypeData();
        this.apiVehicleType = this.apiUrlService.apiVehicleTypeData();
        this.apiStatusSlot = this.apiUrlService.apiStatusSlotData();

    }

    // CRUD STATUS
    getStatusCatalog(): Observable<StatusCatalog> {
        return this.http.get<StatusCatalog>(this.apiStatus);
    }
    addStatusItem(newItem: CreateStatus): Observable<StatusItem> {
        return this.http.post<StatusItem>(this.apiStatus, newItem);
    }
    updateStatusItem(updatedItem: StatusItem): Observable<StatusItem> {
        return this.http.put<StatusItem>(`${this.apiStatus}/${updatedItem.id}`, updatedItem);
    }
    deleteStatusItem(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiStatus}/${id}`);
    }

    // CRUD BENEFIT TYPES
    getBenefitTypeCatalog(): Observable<BenefitTypeCatalog> {
        return this.http.get<BenefitTypeCatalog>(this.apiBenefitType);
    }
    addBenefitType(newItem: CreateBenefitType): Observable<CatalogBenefitType> {
        return this.http.post<CatalogBenefitType>(this.apiBenefitType, newItem);
    }
    updateBenefitType(updatedItem: CatalogBenefitType): Observable<CatalogBenefitType> {
        return this.http.put<CatalogBenefitType>(`${this.apiBenefitType}/${updatedItem.id}`, updatedItem);
    }
    deleteBenefitType(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiBenefitType}/${id}`);
    }

    // CRUD VEHICLE TYPE
    getVehicleTypeCatalog(): Observable<VehicleTypeCatalog> {
        return this.http.get<VehicleTypeCatalog>(this.apiVehicleType);
    }
    addVehicleType(newItem: CreateVehicle): Observable<CatalogVehicleType> {
        return this.http.post<CatalogVehicleType>(this.apiVehicleType, newItem);
    }
    updateVehicleType(updatedItem: CatalogVehicleType): Observable<CatalogVehicleType> {
        return this.http.put<CatalogVehicleType>(`${this.apiVehicleType}/${updatedItem.id}`, updatedItem);
    }
    deleteVehicleType(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiVehicleType}/${id}`);
    }

    // CRUD SLOT TYPE
    getSlotTypeCatalog(): Observable<SlotTypeCatalog> {
        return this.http.get<SlotTypeCatalog>(this.apiSlotType);
    }
    addSlotType(newItem: CreateSlotType): Observable<CatalogSlotType> {
        return this.http.post<CatalogSlotType>(this.apiSlotType, newItem);
    }
    updateSlotType(updatedItem: CatalogSlotType): Observable<CatalogSlotType> {
        return this.http.put<CatalogSlotType>(`${this.apiSlotType}/${updatedItem.id}`, updatedItem);
    }
    deleteSlotType(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiSlotType}/${id}`);
    }

    // CRUD SLOT STATUS
    getSlotStatusCatalog(): Observable<SlotStatusCatalog> {
        return this.http.get<SlotStatusCatalog>(this.apiStatusSlot);
    }
    addSlotStatus(newItem: CreateSlotStatus): Observable<CatalogSlotStatus> {
        return this.http.post<CatalogSlotStatus>(this.apiStatusSlot, newItem);
    }
    updateSlotStatus(updatedItem: CatalogSlotStatus): Observable<CatalogSlotStatus> {
        return this.http.put<CatalogSlotStatus>(`${this.apiStatusSlot}/${updatedItem.id}`, updatedItem);
    }
    deleteSlotStatus(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiStatusSlot}/${id}`);
    }
}
