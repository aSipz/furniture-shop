import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IMainState } from ".";
import { RouterStateUrl } from "./router";
import { IUserState } from "./userReducer";

const mainSelector = createFeatureSelector<IMainState>('main');
const userSelector = createFeatureSelector<IUserState>('user');
const routerSelector = createFeatureSelector<{ state: RouterStateUrl }>('router');

export const getUser = createSelector(userSelector, s => s.user);

export const getCounter = createSelector(mainSelector, s => s.counter);

export const getURL = createSelector(routerSelector, s => s?.state?.url);
export const getParams = createSelector(routerSelector, s => s?.state?.params);
export const getQuery = createSelector(routerSelector, s => s?.state?.queryParams);

export const getProduct = createSelector(mainSelector, s => s.product);