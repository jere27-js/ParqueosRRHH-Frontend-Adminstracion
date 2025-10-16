// Status
export interface CreateStatus {
    name?: string;
    description?: string;
    isActive?: boolean;
}
export interface StatusItem {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
}
export interface StatusCatalog {
    data: StatusItem[];
}

// BenefitType
export interface CreateBenefitType {
    name?: string;
    description?: string;
    sendDocument?: boolean;
    allowAmount?: boolean;
    isActive?: boolean;
}
export interface CatalogBenefitType {
    id: string;
    name: string;
    description: string;
    sendDocument: boolean;
    allowAmount: boolean;
    isActive: boolean;
}
export interface BenefitTypeCatalog {
    data: CatalogBenefitType[];
}

//Vehicle type
export interface CreateVehicle {
    name?: string;
    description?: string;
    isActive?: boolean;
}
export interface CatalogVehicleType {
    id?: string;
    name?: string;
    description?: string;
    isActive?: boolean;
}
export interface VehicleTypeCatalog {
    data: CatalogVehicleType[];
}

//Slot types
export interface CreateSlotType {
    name?: string;
    description?: string;
    allowParallelAssignments?: boolean;
    isActive?: boolean;
}
export interface CatalogSlotType {
    id?: string;
    name?: string;
    description?: string;
    allowParallelAssignments?: boolean;
    isActive?: boolean;
}
export interface SlotTypeCatalog {
    data: CatalogSlotType[];
}

//Slot status
export interface CreateSlotStatus {
    name?: string;
    description?: string;
    isActive?: boolean;
}
export interface CatalogSlotStatus {
    id?: string;
    name?: string;
    description?: string;
    isActive?: boolean;
}
export interface SlotStatusCatalog {
    data: CatalogSlotStatus[];
}
