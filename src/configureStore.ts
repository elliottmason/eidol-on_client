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
  ICombatantDeployment,
  Id,
  IDeployedCombatantMoveTargeting,
  IMatch,
  IMatchEventDamage,
  IMatchJSON,
  IMatchUpdatePending,
  IMoveSelection,
  MatchContext,
  IMove,
} from "./interfaces";
import { nullCombatant } from "./nullObjects";

const initialState: IAppState = {
  match: {
    boardPositions: [],
    combatantDeployments: List(),
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

const cancelCombatantDeployments: (state: IAppState) => IAppState = (
  state: IAppState,
): IAppState => ({
  ...state,
  match: {
    ...state.match,
    context: {
      kind: "benchedCombatantSelection",
    },
  },
});

const cancelMoveSelectons: (state: IAppState) => IAppState = (
  state: IAppState,
): IAppState => {
  const { moveSelections } = state.match;

  const oldCombatants: List<ICombatant> = state.match.combatants;

  const combatants: List<ICombatant> = oldCombatants.map(
    (combatant: ICombatant) => {
      const moveSelectionForCombatant:
        | IMoveSelection
        | undefined = moveSelections.find(
        (moveSelection: IMoveSelection) =>
          moveSelection.combatantId === combatant.id,
      );
      if (moveSelectionForCombatant !== undefined) {
        return {
          ...combatant,
          availability: "available",
        };
      }

      return combatant;
    },
  );

  const availableFriendlyCombatants: List<ICombatant> = combatants.filter(
    (combatant: ICombatant) =>
      combatant.availability === "available" && combatant.isFriendly,
  );
  const selectedCombatant: ICombatant = availableFriendlyCombatants.get(
    0,
    nullCombatant,
  );
  const combatantId: Id = selectedCombatant.id;

  return {
    ...state,
    match: {
      ...state.match,
      combatants,
      context: {
        combatantId,
        kind: "deployedCombatantMoveSelection",
      },
      moveSelections: List(),
    },
  };
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

  const oldCombatantDeployments: List<ICombatantDeployment> =
    state.match.combatantDeployments;
  const combatantDeployments: List<
    ICombatantDeployment
  > = oldCombatantDeployments.push({
    boardPositionId,
    combatantId: oldCombatant.id,
  });

  const isDeploymentFinished: boolean =
    combatantDeployments.size === maxDeployedFriendlyCombatants ||
    benchedFriendlyCombatants.size === 0;

  const context: MatchContext = isDeploymentFinished
    ? { kind: "combatantDeploymentConfirmation" }
    : { kind: "benchedCombatantSelection" };

  return {
    ...state,
    match: {
      ...state.match,
      combatantDeployments,
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

const awaitMatchUpdate: (state: IAppState) => IAppState = (
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

  const combatantDeployments: List<ICombatantDeployment> = List();

  const combatants: List<ICombatant> =
    match.combatants === undefined
      ? state.match.combatants
      : List(match.combatants);

  const friendlyCombatants: List<ICombatant> = combatants.filter(
    (combatant: ICombatant) => combatant.isFriendly,
  );

  const benchedCombatants: List<ICombatant> = friendlyCombatants.filter(
    (combatant: ICombatant) => combatant.availability === "benched",
  );

  const deployedFriendlyCombatants: List<
    ICombatant
  > = friendlyCombatants.filter(
    (combatant: ICombatant) => combatant.boardPositionId !== undefined,
  );

  const availableDeployedFriendlyCombatants: List<
    ICombatant
  > = friendlyCombatants.filter(
    (combatant: ICombatant) => combatant.availability === "available",
  );

  const selectedCombatant: ICombatant = availableDeployedFriendlyCombatants.get(
    0,
    nullCombatant,
  );

  let context: MatchContext;

  const deployedCombatantMax: number = 2;

  if (
    deployedFriendlyCombatants.size < deployedCombatantMax &&
    benchedCombatants.size >= 1
  ) {
    context = {
      kind: "benchedCombatantSelection",
    };
  } else if (availableDeployedFriendlyCombatants.size > 0) {
    context = {
      combatantId: selectedCombatant.id,
      kind: "deployedCombatantMoveSelection",
    };
  } else {
    context = {
      kind: "matchUpdatePending",
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
      combatantDeployments,
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
      combatant.availability !== "queued" &&
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
          availability: "queued",
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
    case "CANCEL_COMBATANT_DEPLOYMENTS":
      return cancelCombatantDeployments(state);
    case "CANCEL_MOVE_SELECTIONS":
      return cancelMoveSelectons(state);
    case "DEPLOY_BENCHED_COMBATANT":
      return deployBenchedCombatant(state, action);
    case "PLAY_MATCH_EVENT":
      return playMatchEvent(state, action);
    case "SELECT_COMBATANT_FOR_DEPLOYMENT":
      return selectCombatantForDeployment(state, action);
    case "SELECT_MOVE":
      return selectMove(state, action);
    case "SUBMIT_COMBATANT_DEPLOYMENTS":
    case "SUBMIT_MOVE_SELECTIONS":
      return awaitMatchUpdate(state);
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
