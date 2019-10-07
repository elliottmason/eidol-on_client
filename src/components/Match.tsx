import { List } from "immutable";
import React, { CSSProperties } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
  IActionPlayMatchEvent,
  IActionSyncMatch,
  ICombatant,
  Id,
  IMatch,
  IMatchesChannelJSON,
  IMatchEvent,
  IMatchJSON,
  IPlayer,
  MatchContext,
} from "../interfaces";

import { Board } from "./Board";
import { BenchedCombatantSelectionMenu } from "./menus/BenchedCombatantSelectionMenu";
import { MoveSelectionConfirmationMenu } from "./menus/MoveSelectionConfirmationMenu";
import { MoveSelectionMenu } from "./menus/MoveSelectionMenu";

interface IMatchProps {
  context?: MatchContext;
  id?: Id;
  match: IMatch;
  path: string;
}

export interface IMatchComponentProps extends IMatchProps {
  dispatch(func: {}): void;
}

const playMatchEvent:
  (event: IMatchEvent) => IActionPlayMatchEvent =
  (event: IMatchEvent): IActionPlayMatchEvent => (
    {
      event,
      type: "PLAY_MATCH_EVENT",
    }
  );

const syncMatch: (match: IMatchJSON) => IActionSyncMatch =
  (match: IMatchJSON): IActionSyncMatch => (
    {
      match,
      type: "SYNC_MATCH",
    }
  );

const connectToMatch: (matchId: Id) => (dispatch: Dispatch) => {
  channel: string;
  room: Id;
  type: undefined;
  received(payload: IMatchesChannelJSON): void;
} = (matchId: Id): (dispatch: Dispatch) => {
  channel: string;
  room: Id;
  type: undefined;
  received(payload: IMatchesChannelJSON): void;
} =>
    (dispatch: Dispatch): {
      channel: string;
      room: Id;
      type: undefined;
      received(payload: IMatchesChannelJSON): void;
    } => dispatch({
      channel: "MatchesChannel",
      received: (payload: IMatchesChannelJSON): void => {
        const { match } = payload;
        let matchTurn: number | undefined = match.turn;
        if (matchTurn === undefined) { matchTurn = 1; }

        const currentMatchTurn: number = matchTurn - 1;

        let matchEventsForTurn: IMatchEvent[];

        const baseTimeout: number = 3000;

        if (payload.kind === "update") {
          let matchEvents: IMatchEvent[] | undefined = match.events;
          if (matchEvents === undefined) { matchEvents = []; }

          matchEventsForTurn = matchEvents.filter(
            (matchEvent: IMatchEvent) => (
              matchEvent.turn === currentMatchTurn
            ),
          );

          matchEventsForTurn.forEach(
            (matchEvent: IMatchEvent, index: number) => {
              const delay: number = baseTimeout * index;
              setTimeout(() => dispatch(playMatchEvent(matchEvent)), delay);
            },
          );
        } else {
          matchEventsForTurn = [];
        }

        const syncDelay: number = baseTimeout * matchEventsForTurn.length;
        setTimeout(() => dispatch(syncMatch(match)), syncDelay);
      },
      room: matchId,
      type: undefined,
    });

class MatchComponent extends React.Component<IMatchComponentProps> {
  public componentDidMount(): void {
    const { dispatch, id } = this.props;

    if (id === undefined) { return; }

    dispatch(connectToMatch(id));
  }

  public render(): JSX.Element {
    return (
      <div className="Match" style={this.style()}>
        <Board
          isReversed={this.isBoardReversed()}
          positions={this.props.match.boardPositions}
        />
        {this.renderMenu()}
      </div>
    );
  }

  private isBoardReversed(): boolean {
    const { players } = this.props.match;
    const secondPlayer: IPlayer | undefined =
      players.sort(
        (playerA: IPlayer, playerB: IPlayer) =>
          parseInt(playerB.id, 10) - parseInt(playerA.id, 10),
      )[0];
    const localPlayer: IPlayer | undefined =
      players.find((player: IPlayer) => player.isLocalPlayer);

    if (localPlayer === undefined || secondPlayer === undefined) {
      return false;
    }

    return localPlayer.id === secondPlayer.id;
  }

  private renderMenu(): JSX.Element | undefined {
    switch (this.props.match.context.kind) {
      case ("benchedCombatantSelection"):
        const benchedFriendlyCombatants: List<ICombatant> =
          this.props.match.combatants.filter(
            (combatant: ICombatant) =>
              combatant.isFriendly && (
                combatant.boardPositionId === null ||
                combatant.boardPositionId === undefined
              ),
          );

        return (
          <BenchedCombatantSelectionMenu
            combatants={benchedFriendlyCombatants}
          />
        )
      case ("deployedCombatantMoveSelection"):
        const combatantId: string = this.props.match.context.combatantId;
        const combatant: ICombatant | undefined =
          this.props.match.combatants.find(
            (potentialCombatant: ICombatant) =>
              (potentialCombatant.id === combatantId),
          );

        if (combatant !== undefined) {
          return (
            <MoveSelectionMenu
              combatant={combatant}
            />
          );
        }
        break;
      case ("moveSelectionConfirmation"):

        return (
          <MoveSelectionConfirmationMenu
            moveSelections={this.props.match.moveSelections}
          />
        );
      default:
        return undefined;
    }
  }

  private readonly style = (): CSSProperties => (
    {
      alignItems: "flex-start",
      display: "flex",
      height: "100%",
      justifyContent: "center",
      position: "relative",
    }
  )
}

export const Match: React.ComponentClass<IMatchProps> =
  connect()(MatchComponent);
