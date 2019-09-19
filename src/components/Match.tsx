import React, { CSSProperties } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
  IActionSyncMatch,
  ICombatant,
  Id,
  IFriendlyCombatant,
  IMatch,
  MatchContext,
  IMatchJSON,
} from "../interfaces";

import { Board } from "./Board";
import { MoveSelectionConfirmationMenu } from "./MoveSelectionConfirmationMenu";
import { MoveSelectionMenu } from "./MoveSelectionMenu";

interface IMatchProps {
  context?: MatchContext;
  id?: Id;
  match: IMatch;
  path: string;
}

export interface IMatchComponentProps extends IMatchProps {
  dispatch(func: {}): void;
}

const syncMatch: (match: IMatchJSON) => IActionSyncMatch =
  (match: IMatchJSON): IActionSyncMatch => (
    {
      match,
      type: "SYNC_MATCH",
    }
  );

const connectToMatch: (id: string) => (dispatch: Dispatch) => {
  channel: string;
  room: string;
  type: undefined;
  received(match: IMatchJSON): IActionSyncMatch;
} = (id: Id): (dispatch: Dispatch) => {
  channel: string;
  room: string;
  type: undefined;
  received(match: IMatchJSON): IActionSyncMatch;
} =>
    (dispatch: Dispatch): {
      channel: string;
      room: string;
      type: undefined;
      received(match: IMatchJSON): IActionSyncMatch;
    } => dispatch({
      channel: "MatchesChannel",
      received: (match: IMatchJSON): IActionSyncMatch => dispatch(syncMatch(match)),
      room: id,
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
        <Board board={this.props.match.board} />
        {this.renderMenu()}
      </div >
    );
  }

  private renderMenu(): JSX.Element | undefined {
    switch (this.props.match.context.kind) {
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
              combatant={combatant as IFriendlyCombatant}
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
      alignItems: "center",
      display: "flex",
      height: "100%",
      justifyContent: "center",
      position: "relative",
    }
  )
}

export const Match: React.ComponentClass<IMatchProps> =
  connect()(MatchComponent);
