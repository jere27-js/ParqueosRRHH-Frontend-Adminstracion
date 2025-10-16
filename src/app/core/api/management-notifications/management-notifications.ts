export interface NotificationIndividual {
    subject: string;
    message: string;
    isScheduled: boolean;
    recipientType: string;
    recipientId: string;
}
export interface NotificationAll {
    subject: string;
    message: string;
    isScheduled: boolean;
    recipientType: string;
}

export interface NotificationTags {
    subject: string;
    message: string;
    isScheduled: boolean;
    recipientType: string;
    recipientId: string;
}

export interface Tag {
    id: string;
    name: string;
    description: string;
    status: string;
}

export interface User {
    id: string;
    employeeCode: string;
    name: string;
    workplace: string;
    email: string;
    phone: string;
}

export interface Notification {
    id: string;
    subject: string;
    message: string;
    notificationDate: Date;
    isScheduled: boolean;
    emailStatus: String;
    recipients: string;
    tagName: string;
    source: string;
}

export interface NotificationsResponse {
    data: Notification[];
}

export interface isScheduledIndividual {
    subject: string;
    message: string;
    isScheduled: boolean;
    notificationDate: Date;
    recipientType: string;
    recipientId: string;
}

export interface isScheduledTags {
    subject: string;
    message: string;
    isScheduled: boolean;
    notificationDate: Date;
    recipientType: string;
    recipientId: string;
}

export interface isScheduledAll {
    subject: string;
    message: string;
    isScheduled: boolean;
    notificationDate: Date;
    recipientType: string;
}
