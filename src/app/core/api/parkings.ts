
export interface ParkingData {
    name: string,
    address: string,
    numberOfIdentifier?: string,
    contactReference: string,
    phone: string,
    email: string,
    comments: string,
    status: string,
    slots: slots[];
    slotsToDelete?: string[];

};

export interface slots {
    //slotNumber: number;
    id?: string;
    slotNumber: string;
    slotType: string;
    limitOfAssignments: number;
    status: string;
    benefitType: string;
    vehicleType: string;
    amount: number;

}

export interface NewParking {
    push(parkingData: ParkingData[]): unknown;
}


export interface Parking {
    id?: string;
    name?: string;
    address?: string;
    contactReference?: string;
    phone?: number;
    email?: string;
    comments?: string;
    numberOfIdentifier?: string;
    status?: string;
    totalSlots?: number;
    availableSlots?: number;
    unavailableSlots?: number;
    occupiedSlots?: number;
}
export interface ParkingResponse {
    data: Parking[];
    pageCounter: number;
}


interface slotsToDelete {
    id: string;
    slotNumber: number;

}



