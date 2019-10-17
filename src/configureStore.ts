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
  IActionDeployBenchedCombatant,
  IActionPlayMatchEvent,
  IActionSelectCombatantForDeployment,
  IActionSelectMove,
  IActionSyncMatch,
  IActionTargetBoardPosition,
  IAppState,
  ICombatant,
  Id,
  IDeployedCombatantMoveTargeting,
  IMatch,
  IMatchEventDamage,
  IMatchJSON,
  IMatchUpdatePending,
  IMoveSelection,
  MatchContext,
} from "./interfaces";

const initialState: IAppState = {
  match: {
    boardPositions: [],
    combatants: List(),
    context: { kind: "matchNotLoaded" },
    events: [],
    id: "0",
    moveSelections: List(),
    players: [],
    turn: 0,
  },
};

const maxDeployedFriendlyCombatants: number = 2;

const nullCombatant: ICombatant = {
  id: "0",
  isFriendly: true,
  isQueued: false,
  isSelectedForDeployment: false,
  maximumHealth: 0,
  moves: [],
  name: "Eidol",
  remainingHealth: 0,
};

const deployBenchedCombatant: (
  state: IAppState,
  action: IActionDeployBenchedCombatant,
) => IAppState = (
  state: IAppState,
  action: IActionDeployBenchedCombatant,
): IAppState => {
  const { boardPositionId }: { boardPositionId: Id } = action;
  const oldMatch: IMatch = state.match;
  const oldCombatants: List<ICombatant> = oldMatch.combatants;

  let combatantId: Id;
  if (oldMatch.context.kind === "benchedCombatantPlacement") {
    combatantId = oldMatch.context.combatantId;
  }

  const combatantIndex: number = oldCombatants.findIndex(
    (combatant: ICombatant) => combatant.id === combatantId,
  );

  const oldCombatant: ICombatant = oldCombatants.get(
    combatantIndex,
    nullCombatant,
  );

  const newCombatant: ICombatant = {
    ...oldCombatant,
    boardPositionId,
  };

  const combatants: List<ICombatant> = oldCombatants.splice(
    combatantIndex,
    1,
    newCombatant,
  );

  const friendlyCombatants: List<ICombatant> = combatants.filter(
    (combatant: ICombatant) => combatant.isFriendly,
  );

  const benchedFriendlyCombatants: List<ICombatant> = friendlyCombatants.filter(
    (combatant: ICombatant) =>
      combatant.boardPositionId === null ||
      combatant.boardPositionId === undefined,
  );

  const deployedFriendlyCombatants: List<
    ICombatant
  > = friendlyCombatants.filter(
    (combatant: ICombatant) =>
      combatant.boardPositionId !== null &&
      combatant.boardPositionId !== undefined,
  );

  const isDeploymentFinished: boolean =
    deployedFriendlyCombatants.size === maxDeployedFriendlyCombatants ||
    benchedFriendlyCombatants.size === 0;

  const context: MatchContext = isDeploymentFinished
    ? { kind: "combatantDeploymentConfirmation" }
    : { kind: "benchedCombatantSelection" };

  return {
    ...state,
    match: {
      ...state.match,
      combatants,
      context,
    },
  };
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
  const match: IMatchJSON = action.match;

  let { boardPositions, events, id, players, turn }: IMatchJSON = match;

  if (boardPositions === undefined) {
    boardPositions = state.match.boardPositions;
  }

  const combatants: List<ICombatant> =
    match.combatants === undefined
      ? state.match.combatants
      : List(match.combatants);

  const friendlyCombatants: List<ICombatant> = combatants.filter(
    (combatant: ICombatant) => combatant.isFriendly,
  );

  const deployedFriendlyCombatants: List<
    ICombatant
  > = friendlyCombatants.filter(
    (combatant: ICombatant) =>
      combatant.boardPositionId !== null &&
      combatant.boardPositionId !== undefined,
  );

  const selectedCombatant: ICombatant = deployedFriendlyCombatants.get(
    0,
    nullCombatant,
  );

  let context: MatchContext;

  const deployedCombatantMax: number = 2;

  if (deployedFriendlyCombatants.size === deployedCombatantMax) {
    context = {
      combatantId: selectedCombatant.id,
      kind: "deployedCombatantMoveSelection",
    };
  } else {
    context = {
      kind: "benchedCombatantSelection",
    };
  }

  if (events === undefined) {
    events = state.match.events;
  }

  if (id === undefined) {
    id = "0";
  }

  const moveSelections: List<IMoveSelection> = state.match.moveSelections;

  if (players === undefined) {
    players = state.match.players;
  }

  if (turn === undefined) {
    turn = state.match.turn;
  }

  return {
    ...state,
    match: {
      boardPositions,
      combatants,
      context,
      events,
      id,
      moveSelections,
      players,
      turn,
    },
  };
};

const playMatchEvent: (
  state: IAppState,
  action: IActionPlayMatchEvent,
) => IAppState = (
  state: IAppState,
  action: IActionPlayMatchEvent,
): IAppState => {
  switch (action.event.category) {
    case "damage":
      const event: IMatchEventDamage = action.event as IMatchEventDamage;
      const combatantId: string = event.matchCombatantId;
      const oldCombatants: List<ICombatant> = state.match.combatants;
      const oldCombatantIndex: number = oldCombatants.findIndex(
        (combatant: ICombatant) => combatant.id === combatantId,
      );
      const oldCombatant: ICombatant | undefined = oldCombatants.get(
        oldCombatantIndex,
      );

      if (oldCombatant !== undefined) {
        const remainingHealth: number =
          oldCombatant.remainingHealth - event.amount;
        const newCombatant: ICombatant = {
          ...oldCombatant,
          remainingHealth,
        };
        const combatants: List<ICombatant> = oldCombatants.splice(
          oldCombatantIndex,
          1,
          newCombatant,
        );

        return {
          ...state,
          match: {
            ...state.match,
            combatants,
          },
        };
      }

      return state;
    default:
      return state;
  }
};

const selectCombatantForDeployment: (
  state: IAppState,
  action: IActionSelectCombatantForDeployment,
) => IAppState = (
  state: IAppState,
  action: IActionSelectCombatantForDeployment,
): IAppState => {
  const { combatantId } = action;
  const context: MatchContext = {
    combatantId,
    kind: "benchedCombatantPlacement",
  };

  const oldCombatants: List<ICombatant> = state.match.combatants;
  const combatants: List<ICombatant> = oldCombatants.map(
    (combatant: ICombatant) => ({
      ...combatant,
      isSelectedForDeployment: combatant.id === combatantId,
    }),
  );

  return {
    ...state,
    match: {
      ...state.match,
      combatants,
      context,
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

  /* We haven't yet queued the Combatant that's using this move, so we check for
     only 1 unqueued Combatant here */
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
    case "DEPLOY_BENCHED_COMBATANT":
      return deployBenchedCombatant(state, action);
    case "PLAY_MATCH_EVENT":
      return playMatchEvent(state, action);
    case "SELECT_COMBATANT_FOR_DEPLOYMENT":
      return selectCombatantForDeployment(state, action);
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
