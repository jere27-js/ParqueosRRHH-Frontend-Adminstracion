export interface Tags {
    id: string;
    name: string;
    description: string;
    status: string;
}

export interface TagResponse {
    data: Tags;
    pageCounter: number;
}
