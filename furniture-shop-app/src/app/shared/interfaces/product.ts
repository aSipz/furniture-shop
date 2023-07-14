import { IImageEntry } from "./imageEntry";
import { IRating } from "./rating";
import { IReview } from "./review";

export interface IProduct {
    _id: string;
    name: string;
    description: string;
    category: string;
    color: string;
    material: string;
    price: number;
    discount: number;
    quantity: number;
    images?: IImageEntry[];
    reviews?: IReview[];
    ratings?: IRating[];
    createdAt: string;
    updatedAt: string;
    ownerId?: string;
    deleted?: boolean;
}