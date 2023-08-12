import { ActionReducerMap } from "@ngrx/store";
import { routerReducer } from "@ngrx/router-store";
import { IUserState, userReducer } from "./reducers/userReducer";
import { ICartState, cartReducer } from "./reducers/cartReducer";

// export interface IMainState {
//     counter: number;
//     product: IProduct | null;
// };

interface IAppState {
    // main: IMainState;
    router: ReturnType<typeof routerReducer>;
    user: IUserState;
    cart: ICartState
};

// const mainInitialState: IMainState = {
//     counter: 0,
//     product: null,
// }

// const mainReducer = createReducer<IMainState>(
//     mainInitialState,
//     on(increment, (state) => {
//         const { counter } = state;
//         return { ...state, counter: counter + 1 }
//     }),
//     on(setCounter, (state, action) => {
//         const { counter } = action;
//         return { ...state, counter };
//     }),
//     on(loadProductSuccess, (state, { product }) => {
//         return { ...state, product };
//     })
// );

export const reducers: ActionReducerMap<IAppState> = {
    // main: mainReducer,
    router: routerReducer,
    user: userReducer,
    cart: cartReducer
};