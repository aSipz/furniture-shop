import { createReducer, on } from "@ngrx/store";
import { ICartProduct } from "src/app/initial/interfaces";
import { updateCart } from "../actions/cartActions";

export interface ICartState {
    cart: ICartProduct[] | null;
};

const initialCartState: ICartState = {
    cart: null,
};

export const cartReducer = createReducer<ICartState>(
    initialCartState,
    on(updateCart, (state, { cart }) => ({ cart })),
);