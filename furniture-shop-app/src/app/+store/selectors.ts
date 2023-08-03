import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IMainState } from ".";
import { RouterStateUrl } from "./router";

const mainSelector = createFeatureSelector<IMainState>('main');
const routerSelector = createFeatureSelector<{ state: RouterStateUrl }>('router');

export const getCounter = createSelector(mainSelector, s => s.counter);

export const getURL = createSelector(routerSelector, s => s?.state?.url);
export const getParams = createSelector(routerSelector, s => s?.state?.params);
export const getQuery = createSelector(routerSelector, s => s?.state?.queryParams);