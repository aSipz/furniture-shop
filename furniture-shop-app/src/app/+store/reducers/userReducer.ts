import { createReducer, on } from "@ngrx/store";
import { IUser } from "../../initial/interfaces";
import {
    deleteProfileSuccess,
    loadUserFailure,
    loadUserSuccess,
    loginSuccess,
    logoutFailure,
    logoutSuccess,
    registerSuccess,
    updateProfileSuccess
} from "../actions/userActions";

export interface IUserState {
    user: IUser | null;
};

const userInitialState: IUserState = {
    user: null
}

export const userReducer = createReducer<IUserState>(
    userInitialState,
    on(loadUserSuccess, (state, { user }) => ({ user })),
    on(loadUserFailure, () => ({ user: null })),
    on(logoutSuccess, () => ({ user: null })),
    on(logoutFailure, () => ({ user: null })),
    on(loginSuccess, (state, { user }) => ({ user })),
    on(registerSuccess, (state, { user }) => ({ user })),
    on(updateProfileSuccess, (state, { user }) => ({ user })),
    on(deleteProfileSuccess, () => ({ user: null })),
);