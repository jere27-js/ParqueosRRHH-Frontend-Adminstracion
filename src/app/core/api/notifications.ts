export interface User{
    id?: string,
    name?:string,
    email?: string,
    username?: string,
    status?: string,
    phone?: string,
    role?: string
    notificationPreferences?: notificationsPreferences[]; // Cambiar el nombre aquí
}

export interface notificationsPreferences {
    notificationType: string;
    enable: boolean;
}
