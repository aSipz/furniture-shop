import { createReducer, on } from "@ngrx/store";
import { IUser } from "../initial/interfaces";
import { loadUserFailure, loadUserSuccess, loginSuccess, logoutFailure, logoutSuccess } from "./actions";

export interface IUserState {
    user: IUser | null;
};

const userInitialState: IUserState = {
    user: null
}

export const userReducer = createReducer<IUserState>(
    userInitialState,
    on(loadUserSuccess, (state, { user }) => {
        return { user };
    }),
    on(loadUserFailure, () => {
        return { user: null };
    }),
    on(logoutSuccess, () => {
        return { user: null };
    }),
    on(logoutFailure, () => {
        return { user: null };
    }),
    on(loginSuccess, (state, { user }) => ({ user })),
    // on(increment, (state) => {
    //     const { counter } = state;
    //     return { ...state, counter: counter + 1 }
    // }),
    // on(setCounter, (state, action) => {
    //     const { counter } = action;
    //     return { ...state, counter };
    // }),
    // on(loadProductSuccess, (state, { product }) => {
    //     return { ...state, product };
    // })
);