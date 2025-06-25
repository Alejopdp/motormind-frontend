export interface VendorResources {
    platform: string;
    username: string;
    password: string;
}

export interface Workshop {
    _id: string;
    name: string;
    pricePerHour: number;
    bodyworkHourlyRate?: number;
    vendorResources?: VendorResources;
    createdAt: Date;
    updatedAt: Date;
} 