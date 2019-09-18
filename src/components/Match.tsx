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
} from "../interfaces";

import { Board } from "./Board";
import { MoveSelectionConfirmationMenu } from "./MoveSelectionConfirmationMenu";
import { MoveSelectionMenu } from "./MoveSelectionMenu";

interface IMatchProps {
  context?: MatchContext;
  id: Id;
  match: IMatch;
  path: string;
}

export interface IMatchComponentProps extends IMatchProps {
  dispatch(func: {}): void;
}

const fetchMatch: (matchId: string) => Promise<Response> =
  (matchId: string): Promise<Response> => (
    fetch(`http://localhost:4000/matches/${matchId}.json`)
  );

const syncMatch: (match: IMatch) => IActionSyncMatch =
  (match: IMatch): IActionSyncMatch => (
    {
      match,
      type: "SYNC_MATCH",
    }
  );

const loadMatch:
  (matchId: string) => (dispatch: Dispatch) => Promise<void> =
  (matchId: string): (dispatch: Dispatch) => Promise<void> => (
    (dispatch: Dispatch): Promise<void> =>
      fetchMatch(matchId)
        .then(
          (response: Response) => {
            response.json()
              .then(
                (json: IMatch) => dispatch(syncMatch(json)),
                // tslint:disable-next-line
                (error) => console.error(error),
              );
          },
        )
  );

class MatchComponent extends React.Component<IMatchComponentProps> {
  public componentDidMount(): void {
    const { dispatch, id } = this.props;

    dispatch(loadMatch(id));
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
