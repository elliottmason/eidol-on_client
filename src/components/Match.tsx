import React, { CSSProperties } from "react";

import { IMatchProps } from "../interfaces";

import { Board } from "./Board";
import { MoveSelectionMenu } from "./MoveSelectionMenu";

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
        return (
          <MoveSelectionMenu
            combatant={this.props.match.context.combatant}
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
