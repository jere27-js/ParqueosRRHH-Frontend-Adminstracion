import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiUrlService {
    private apiURL = environment.apiUrlBase + environment.apiVersion;

    constructor() { }

    apiLocationReports() {
        const SLUG = 'reports/locations';
        return this.apiURL + SLUG;
    }

    apiEmployeeReport() {
        const SLUG = 'reports/collaborators';
        return this.apiURL + SLUG;
    }

    apiDetailWithCostReport() {
        const SLUG = 'reports/details-with-cost';
        return this.apiURL + SLUG;
    }

    apiParkingAssignedPeriodReport() {
        const SLUG = 'reports/assigned-parking-spots';
        return this.apiURL + SLUG;
    }

    //Assigned
    apiAssignmentsData() {
        const SLUG = 'assignment';
        return this.apiURL + SLUG;
    }

    apiAssignmentsEmployeeData() {
        const SLUG = this.apiAssignmentsData() + '/employee/';
        return SLUG;
    }

    apiAssignmentsSlotData() {
        const SLUG = this.apiParkingLocationData() + '/available-slots/';
        return SLUG;
    }

    //Assignments loan
    apiAssignmentsLoanData() {
        const SLUG = this.apiAssignmentsData() + '/assignment-loan';
        return SLUG;
    }

    //DiscountNoteService
    apiDiscountNoteData() {
        const SLUG = this.apiAssignmentsData() + '/discount-note';
        return SLUG;
    }
    apiDiscountNoteNotifications() {
        const SLUG = this.apiDiscountNoteData() + '/notification';
        return SLUG;
    }

    //acceptance-form
    apiAcceptanceData() {
        const SLUG = this.apiAssignmentsData() + '/acceptance';
        return SLUG;
    }

    // Parking
    apiParkingLocationData() {
        const SLUG = 'parking/location';
        return this.apiURL + SLUG;
    }

    // User
    apiUserParameterData() {
        const SLUG = 'parameter/users';
        return this.apiURL + SLUG;
    }

    // Roles
    apiRolesParameterData() {
        const SLUG = 'parameter/roles';
        return this.apiURL + SLUG;
    }
    apiRoleResourceData() {
        const SLUG = this.apiRolesParameterData() + '/resources';
        return SLUG;
    }

    //login
    apiAuthLogin(){
        const SLUG = 'auth/login';
        return this.apiURL + SLUG;
    }
    //logout
    apiAuthlogout(){
        const SLUG = 'auth/logout';
        return this.apiURL + SLUG;
    }

    //Groups
    apiTagParameterData() {
        const SLUG = 'parameter/tag';
        return this.apiURL + SLUG;
    }

    //Setting
    apiSettingParameterData() {
        const SLUG = 'parameter/settings';
        return this.apiURL + SLUG;
    }

    //Template
    apiTemplateParameterData() {
        const SLUG = 'parameter/template';
        return this.apiURL + SLUG;
    }
    apiTemplateVariablesData() {
        const SLUG = this.apiTemplateParameterData() + '/variables';
        return SLUG;
    }

    //Notifications
    apiNotificationParameterData() {
        const SLUG = 'parameter/notifications/preferences';
        return this.apiURL + SLUG;
    }

    //Notifications on demand
    apiNotificationData() {
        const SLUG = 'notification';
        return this.apiURL + SLUG;
    }
    apiNotificationDemandData() {
        const SLUG = this.apiNotificationData() + '/send';
        return SLUG;
    }

    apiAssignmentEmployeeData() {
        const SLUG = this.apiAssignmentsData() + '/employee';
        return SLUG;
    }

   //Status overview
    apiStatusOverviewData() {
        const SLUG = 'parking/location/stats/overview';
        return this.apiURL + SLUG;
    }
    //Catalog
    apiCatalogData() {
        const SLUG = 'parameters/catalogs';
        return this.apiURL + SLUG;
    }

    apiCatalogStatusData() {
        const SLUG = this.apiCatalogData() +'/status-types';
        return  SLUG;
    }
    apiSlotTypeData() {
        const SLUG = this.apiCatalogData() +'/slot-types';
        return SLUG;
    }

    apiBenefitTypeData() {
        const SLUG = this.apiCatalogData() +'/benefit-types';
        return SLUG;
    }
    apiVehicleTypeData() {
        const SLUG = this.apiCatalogData() + '/vehicle-types';
        return SLUG;
    }
    apiStatusSlotData() {
        const SLUG = this.apiCatalogData() +'/status-slot-types';
        return SLUG;
    }

    apiParkingAvailability() {
        const SLUG = 'parking/location/stats/parking-availability';
        return this.apiURL + SLUG;
    }

    apiParkingAvailabilityEmployee() {
        const SLUG = 'parking/location/stats/employees-parking';
        return this.apiURL + SLUG;
    }
}
