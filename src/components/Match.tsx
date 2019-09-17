import React, { CSSProperties } from "react";

import { IMatchProps, IFriendlyCombatant, ICombatant } from "../interfaces";

import { Board } from "./Board";
import { MoveSelectionMenu } from "./MoveSelectionMenu";
import { MoveSelectionConfirmationMenu } from "./MoveSelectionConfirmationMenu"

export class Match extends React.Component<IMatchProps> {
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
