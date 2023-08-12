import { createAction, props } from "@ngrx/store";
import { IUser } from "../../initial/interfaces";

const actionTypes = {
    loadUser: 'LOAD_USER',
    loadUserSuccess: 'LOAD_USER_SUCCESS',
    loadUserFailure: 'LOAD_USER_FAILURE',
    logout: 'LOGOUT',
    logoutSuccess: 'LOGOUT_SUCCESS',
    logoutFailure: 'LOGOUT_FAILURE',
    login: 'LOGIN',
    loginSuccess: 'LOGIN_SUCCESS',
    loginFailure: 'LOGIN_FAILURE',
    register: 'REGISTER',
    registerSuccess: 'REGISTER_SUCCESS',
    registerFailure: 'REGISTER_FAILURE',
    updateProfile: 'UPDATE_PROFILE',
    updateProfileSuccess: 'UPDATE_PROFILE_SUCCESS',
    updateProfileFailure: 'UPDATE_PROFILE_FAILURE',
    deleteProfile: 'DELETE_PROFILE',
    deleteProfileSuccess: 'DELETE_PROFILE_SUCCESS',
    deleteProfileFailure: 'DELETE_PROFILE_FAILURE',
};

export const loadUser = createAction(actionTypes.loadUser);
export const loadUserSuccess = createAction(actionTypes.loadUserSuccess, props<{ user: IUser }>());
export const loadUserFailure = createAction(actionTypes.loadUserFailure, props<{ error: any }>());

export const logout = createAction(actionTypes.logout);
export const logoutSuccess = createAction(actionTypes.logoutSuccess);
export const logoutFailure = createAction(actionTypes.logoutFailure, props<{ error: any }>());

export const login = createAction(actionTypes.login, props<{ email: string, password: string }>());
export const loginSuccess = createAction(actionTypes.loginSuccess, props<{ user: IUser }>());
export const loginFailure = createAction(actionTypes.loginFailure, props<{ error: any }>());

export const register = createAction(actionTypes.register, props<{
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
}>());
export const registerSuccess = createAction(actionTypes.registerSuccess, props<{ user: IUser }>());
export const registerFailure = createAction(actionTypes.registerFailure, props<{ error: any }>());

export const updateProfile = createAction(actionTypes.updateProfile, props<{
    username: string,
    email: string,
    password: string | null,
    lastName: string,
    firstName: string,
    oldPassword: string | null
}>());
export const updateProfileSuccess = createAction(actionTypes.updateProfileSuccess, props<{ user: IUser }>());
export const updateProfileFailure = createAction(actionTypes.updateProfileFailure, props<{ error: any }>());

export const deleteProfile = createAction(actionTypes.deleteProfile);
export const deleteProfileSuccess = createAction(actionTypes.deleteProfileSuccess);
export const deleteProfileFailure = createAction(actionTypes.deleteProfileFailure, props<{ error: any }>());