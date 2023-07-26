import { IProduct } from "./product";

export interface IOrder {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
    status: string;
    ownerId: string;
    amount: number;
    products: {
        _id: string;
        count: number;
        productId: string | IProduct
    }[];
    createdAt: string;
    updatedAt: string;
}