import { List } from "immutable";
import {
  applyMiddleware,
  compose,
  createStore,
  Store,
  StoreEnhancer,
} from "redux";
import thunk from "redux-thunk";

import {
  Action,
  IActionSelectMove,
  IActionSyncMatch,
  IActionTargetBoardPosition,
  IAppState,
  ICombatant,
  IFriendlyCombatant,
  MatchContext,
} from "./interfaces";

const initialState: IAppState = {
  match: {
    board: { positions: [] },
    combatants: List(),
    context: { kind: "matchNotLoaded" },
    events: [],
    id: "0",
    players: [],
    turn: 0,
  },
  moveQueue: List(),
};

const nullCombatant: IFriendlyCombatant = {
  id: "0",
  isFriendly: true,
  isQueued: false,
  maximumHealth: 0,
  moves: [],
  name: "Eidol",
  remainingHealth: 0,
};

const selectMove: (state: IAppState, action: IActionSelectMove) => IAppState = (
  state: IAppState,
  action: IActionSelectMove,
): IAppState => {
  const combatant: ICombatant =
    state.match.context.kind === "deployedCombatantMoveSelection"
      ? state.match.context.combatant
      : nullCombatant;

  const matchContext: MatchContext = {
    combatant,
    kind: "deployedCombatantMoveTargeting",
    move: action.move,
  };

  return {
    ...state,
    match: { ...state.match, context: matchContext },
  };
};

const syncMatch: (state: IAppState, action: IActionSyncMatch) => IAppState = (
  state: IAppState,
  action: IActionSyncMatch,
): IAppState => {
  const combatants: List<ICombatant> = List(
    action.match.combatants.map((combatant: ICombatant) => ({
      ...combatant,
      isQueued: false,
    })),
  );
  const friendlyCombatants: List<ICombatant> = combatants.filter(
    (combatant: ICombatant) => combatant.isFriendly,
  );
  const selectedCombatant: ICombatant = friendlyCombatants.get(
    0,
    nullCombatant,
  ) as IFriendlyCombatant;

  const context: MatchContext = {
    combatant: selectedCombatant,
    kind: "deployedCombatantMoveSelection",
  };

  return {
    match: {
      ...action.match,
      combatants,
      context,
    },
    moveQueue: List(),
  };
};

const targetBoardPosition: (
  state: IAppState,
  action: IActionTargetBoardPosition,
) => IAppState = (
  state: IAppState,
  action: IActionTargetBoardPosition,
): IAppState => {
  let newMatchContext: MatchContext;

  const unqueuedFriendlyCombatants: List<
    ICombatant
  > = state.match.combatants.filter(
    (combatant: ICombatant) =>
      combatant.isFriendly &&
      !combatant.isQueued &&
      combatant.boardPositionId !== undefined,
  );

  if (unqueuedFriendlyCombatants.size === 1) {
    newMatchContext = { kind: "moveSelectionConfirmation" };
  } else {
    const combatant: ICombatant = unqueuedFriendlyCombatants.get(
      -1,
      nullCombatant,
    );

    newMatchContext = {
      combatant: combatant as IFriendlyCombatant,
      kind: "deployedCombatantMoveSelection",
    };
  }

  const newCombatants: List<ICombatant> = state.match.combatants.map(
    (combatant: ICombatant) => {
      if (
        state.match.context.kind === "deployedCombatantMoveTargeting" &&
        state.match.context.combatant.id === combatant.id
      ) {
        return {
          ...combatant,
          isQueued: true,
        };
      }

      return combatant;
    },
  );

  return {
    ...state,
    match: {
      ...state.match,
      combatants: newCombatants,
      context: newMatchContext,
    },
  };
};

export const rootReducer: (
  state: IAppState | undefined,
  action: Action,
) => IAppState = (
  state: IAppState = initialState,
  action: Action,
): IAppState => {
  switch (action.type) {
    case "SELECT_MOVE":
      return selectMove(state, action);
    case "SYNC_MATCH":
      return syncMatch(state, action);
    case "TARGET_BOARD_POSITION":
      return targetBoardPosition(state, action);
    default:
      return state;
  }
};

const composeEnhancers: (a: StoreEnhancer) => IAppState =
  // tslint:disable-next-line
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store: Store<{}> = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);
