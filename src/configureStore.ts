import {
  applyMiddleware,
  compose,
  createStore,
  Store,
  StoreEnhancer,
} from "redux";
import thunk from "redux-thunk";

import { IActionSyncMatch, IAppState } from "./interfaces";

const initialState: IAppState = {
  match: {
    board: [],
    combatants: [],
    events: [],
    id: "0",
    players: [],
    turn: 0,
  },
};

export const rootReducer: (
  state: IAppState | undefined,
  action: IActionSyncMatch,
) => IAppState = (
  state: IAppState = initialState,
  action: IActionSyncMatch,
): IAppState => {
  switch (action.type) {
    case "SYNC_MATCH":
      return {
        match: action.match,
      };
    default:
      return state;
  }
};

const composeEnhancers: (a: StoreEnhancer<{ dispatch: unknown }>) => IAppState =
  // tslint:disable-next-line
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store: Store<{}> = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);
