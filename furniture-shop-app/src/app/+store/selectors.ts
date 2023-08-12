import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RouterStateUrl } from "./router";
import { IUserState } from "./reducers/userReducer";
import { ICartState } from "./reducers/cartReducer";

const userSelector = createFeatureSelector<IUserState>('user');
const routerSelector = createFeatureSelector<{ state: RouterStateUrl }>('router');
const cartSelector = createFeatureSelector<ICartState>('cart');

export const getUser = createSelector(userSelector, s => s.user);
export const isLoggedIn = createSelector(userSelector, s => s.user !== null);
export const isAdmin = createSelector(userSelector, s => s.user?.userRights === 'admin');

export const getURL = createSelector(routerSelector, s => s?.state?.url);
export const getParams = createSelector(routerSelector, s => s?.state?.params);
export const getQuery = createSelector(routerSelector, s => s?.state?.queryParams);

export const getCart = createSelector(cartSelector, s => s.cart);