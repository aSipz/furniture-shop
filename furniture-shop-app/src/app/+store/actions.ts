import { createAction, props } from "@ngrx/store";
import { IProduct, IUser } from "../initial/interfaces";

const actionTypes = {
    increment: 'INCREMENT',
    setCounter: 'SET_COUNTER',
    loadProduct: 'LOAD_PRODUCT',
    loadProductSuccess: 'LOAD_PRODUCT_SUCCESS',
    loadProductFailure: 'LOAD_PRODUCT_FAILURE',
    loadUser: 'LOAD_USER',
    loadUserSuccess: 'LOAD_USER_SUCCESS',
    loadUserFailure: 'LOAD_USER_FAILURE',
    logout: 'LOGOUT',
    logoutSuccess: 'LOGOUT_SUCCESS',
    logoutFailure: 'LOGOUT_FAILURE',
    login: 'LOGIN',
    loginSuccess: 'LOGIN_SUCCESS',
    loginFailure: 'LOGIN_FAILURE',
};

export const increment = createAction(actionTypes.increment);
export const setCounter = createAction(actionTypes.setCounter, props<{ counter: number }>());

export const loadProduct = createAction(actionTypes.loadProduct, props<{ productId: string, options?: { [key: string]: string | number | boolean | { [key: string]: any } } }>());
export const loadProductSuccess = createAction(actionTypes.loadProductSuccess, props<{ product: IProduct }>());
export const loadProductFailure = createAction(actionTypes.loadProductFailure, props<{ error: any }>());

export const loadUser = createAction(actionTypes.loadUser);
export const loadUserSuccess = createAction(actionTypes.loadProductSuccess, props<{ user: IUser }>());
export const loadUserFailure = createAction(actionTypes.loadUserFailure, props<{ error: any }>());

export const logout = createAction(actionTypes.logout);
export const logoutSuccess = createAction(actionTypes.logoutSuccess);
export const logoutFailure = createAction(actionTypes.logoutFailure, props<{ error: any }>());

export const login = createAction(actionTypes.login, props<{ email: string, password: string }>());
export const loginSuccess = createAction(actionTypes.loginSuccess, props<{ user: IUser }>());
export const loginFailure = createAction(actionTypes.loginFailure, props<{ error: any }>());

