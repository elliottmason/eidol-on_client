import { List } from "immutable";
import React, { CSSProperties } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
  IActionPlayMatchEvent,
  IActionSyncMatch,
  Id,
  IMatch,
  IMatchesChannelJSON,
  IMatchEvent,
  IMatchJSON,
  IPlayer,
  MatchContext,
} from "../interfaces";

import { Board } from "./Board";
import { MatchMenu } from "./menus/MatchMenu";

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

        let matchEventsForTurn: List<IMatchEvent>;

        const baseTimeout: number = 3000;

        if (payload.kind === "update") {
          let matchEvents: List<IMatchEvent> = List(match.events);
          if (matchEvents === undefined) { matchEvents = List(); }

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
          matchEventsForTurn = List();
        }

        const syncDelay: number = baseTimeout * matchEventsForTurn.size;
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
    const { match } = this.props;
    const { boardPositions, combatants } = match;
    const matchContext: MatchContext = match.context;

    return (
      <div className="Match" style={this.style()}>
        <Board
          combatants={combatants}
          isReversed={this.isBoardReversed()}
          matchContext={matchContext}
          positions={boardPositions}
        />
        <MatchMenu match={match} />
      </div>
    );
  }

  private isBoardReversed(): boolean {
    const { players } = this.props.match;

    /* Sort the players by their ID as an arbitrary but predictable way of
       determining which side of the board "belongs" to which player */
    const sortedPlayers: List<IPlayer> =
      players.sort(
        (playerA: IPlayer, playerB: IPlayer) => {
          const playerAId: number = parseInt(playerA.id, 10);
          const playerBId: number = parseInt(playerB.id, 10);

          if (playerAId < playerBId) { return -1; }
          if (playerAId > playerBId) { return 1; }

          return 0;
        },
      );
    const secondPlayer: IPlayer | undefined = players.first();

    const localPlayer: IPlayer | undefined =
      players.find((player: IPlayer) => player.isLocalPlayer);

    if (localPlayer === undefined || secondPlayer === undefined) {
      return false;
    }

    return localPlayer.id === secondPlayer.id;
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
