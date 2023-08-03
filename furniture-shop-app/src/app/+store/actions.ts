import { createAction, props } from "@ngrx/store";

const actionTypes = {
    increment: 'INCREMENT',
    setCounter: 'SET_COUNTER'
};

export const increment = createAction(actionTypes.increment);
export const setCounter = createAction(actionTypes.setCounter, props<{counter: number}>());

