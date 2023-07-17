import { IProduct } from "./product";

export interface IFavorite {
    _id: string;
    createdAt: string;
    updatedAt: string;
    owner: string;
    product: string | IProduct;
}