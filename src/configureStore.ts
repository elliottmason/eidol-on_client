import { List } from "immutable";
import {
  applyMiddleware,
  compose,
  createStore,
  Store,
  StoreEnhancer,
} from "redux";
import thunk from "redux-thunk";

import { cableMiddleware } from "./cableMiddleware";
import {
  Action,
  IActionSelectMove,
  IActionSyncMatch,
  IActionTargetBoardPosition,
  IAppState,
  ICombatant,
  Id,
  IDeployedCombatantMoveTargeting,
  IFriendlyCombatant,
  IMatchUpdatePending,
  IMoveSelection,
  MatchContext,
} from "./interfaces";

const initialState: IAppState = {
  match: {
    board: { positions: [] },
    combatants: List(),
    context: { kind: "matchNotLoaded" },
    events: [],
    id: "0",
    moveSelections: List(),
    players: [],
    turn: 0,
  },
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
  const combatantId: Id =
    state.match.context.kind === "deployedCombatantMoveSelection"
      ? state.match.context.combatantId
      : "0";

  const newMatchContext: IDeployedCombatantMoveTargeting = {
    combatantId,
    kind: "deployedCombatantMoveTargeting",
    moveId: action.moveId,
  };

  return {
    ...state,
    match: { ...state.match, context: newMatchContext },
  };
};

const submitMoveSelections: (state: IAppState) => IAppState = (
  state: IAppState,
): IAppState => {
  const newMatchContext: IMatchUpdatePending = {
    kind: "matchUpdatePending",
  };

  return {
    ...state,
    match: {
      ...state.match,
      context: newMatchContext,
      moveSelections: List(),
    },
  };
};

const syncMatch: (state: IAppState, action: IActionSyncMatch) => IAppState = (
  state: IAppState,
  action: IActionSyncMatch,
): IAppState => {
  const newCombatants: List<ICombatant> = List(
    action.match.combatants.map((combatant: ICombatant) => ({
      ...combatant,
      isQueued: false,
    })),
  );
  const friendlyCombatants: List<ICombatant> = newCombatants.filter(
    (combatant: ICombatant) => combatant.isFriendly,
  );
  const selectedCombatant: ICombatant = friendlyCombatants.get(
    0,
    nullCombatant,
  ) as IFriendlyCombatant;

  const newMatchContext: MatchContext = {
    combatantId: selectedCombatant.id,
    kind: "deployedCombatantMoveSelection",
  };

  return {
    ...state,
    match: {
      ...action.match,
      combatants: newCombatants,
      context: newMatchContext,
      moveSelections: List(),
    },
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

  /* We haven't queued the Combatant that's using this move, so we check for 1
     unqueued Combatant here */
  if (unqueuedFriendlyCombatants.size <= 1) {
    newMatchContext = { kind: "moveSelectionConfirmation" };
  } else {
    const combatant: ICombatant = unqueuedFriendlyCombatants.get(
      -1,
      nullCombatant,
    );

    newMatchContext = {
      combatantId: combatant.id,
      kind: "deployedCombatantMoveSelection",
    };
  }

  const boardPositionId: Id = action.boardPositionId;

  const combatantId: Id =
    state.match.context.kind === "deployedCombatantMoveTargeting"
      ? state.match.context.combatantId
      : "0";

  const moveId: Id =
    state.match.context.kind === "deployedCombatantMoveTargeting"
      ? state.match.context.moveId
      : "0";

  const newCombatants: List<ICombatant> = state.match.combatants.map(
    (combatant: ICombatant) => {
      if (
        state.match.context.kind === "deployedCombatantMoveTargeting" &&
        combatantId === combatant.id
      ) {
        return {
          ...combatant,
          isQueued: true,
        };
      }

      return combatant;
    },
  );

  const newMoveSelections: List<
    IMoveSelection
  > = state.match.moveSelections.push({
    boardPositionId,
    combatantId,
    moveId,
  });

  return {
    ...state,
    match: {
      ...state.match,
      combatants: newCombatants,
      context: newMatchContext,
      moveSelections: newMoveSelections,
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
    case "SUBMIT_MOVE_SELECTIONS":
      return submitMoveSelections(state);
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
  composeEnhancers(applyMiddleware(cableMiddleware, thunk)),
);
