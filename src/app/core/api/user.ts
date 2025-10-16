
export interface UserData {
    id?: string,
    name?: string,
    description?: string,
    status?: string,
    role?: string
}

export interface User {
    id?: string,
    name?: string,
    email?: string,
    username?: string,
    status?: string,
    phone?: string,
    role?: string
}

// role.model.ts
export interface Role {
    id: string;
    name: string;
    description: string;
    status: string;
    resources: Resource[];
}

export interface Resource {
    id: string;
    slug: string;
    description: string;
    can_access: boolean;
}

export interface RoleResponse {
    data: Role[];
    pageCounter: number;
}


export interface UserResponse {
    data: User[];
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
