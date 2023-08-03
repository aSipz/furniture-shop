import { ActionReducerMap, createReducer, on } from "@ngrx/store";
import { increment, setCounter } from "./actions";

export interface IMainState {
    counter: number;
};

interface IAppState {
    main: IMainState
};

const mainInitialState: IMainState = {
    counter: 0
}

const mainReducer = createReducer<IMainState>(
    mainInitialState,
    on(increment, (state) => {
        const { counter } = state;
        return { ...state, counter: counter + 1 }
    }),
    on(setCounter, (state, action) => {
        const { counter } = action;
        return { ...state, counter };
    }),
);

export const reducers: ActionReducerMap<IAppState> = {
    main: mainReducer
};