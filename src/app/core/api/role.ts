
export interface RoleData {
    id?: string,
    name?: string,
    description?: string,
    status?: string,
    ListOfAccess?: ListOfAccess[]
}

export interface Role {
    id?: string,
    name?: string,
    description?: string,
    status?: string,
    ListOfAccess?: ListOfAccess[]
}

export interface ListOfAccess {
    slug: string
    canAccess: boolean
}

export interface Status {
    name: string,
    code: string
}

export interface RoleResponse {
    data: Role[];
    pageCounter: number;
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
