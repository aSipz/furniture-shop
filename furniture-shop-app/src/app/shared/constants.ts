import { InjectionToken } from "@angular/core";

export const API_ERROR = new InjectionToken('API_ERROR');

export const productCategories = ['Chairs', 'Beds', 'Sofas & armchairs', 'Tables', 'Storage furniture', 'Garden & outdoor', 'Bathroom', 'Desks', 'Accessories', 'Other'];

export class FileUpload {
    key!: string;
    name!: string;
    url!: string;
    file: File;
    isLoading?: boolean;

    constructor(file: File) {
        this.file = file;
    }
}