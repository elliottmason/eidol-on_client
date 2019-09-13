import React from "react";

import { IFriendlyCombatant, IMove } from "../interfaces";

import { MoveSelectionMenuItem } from "./MoveSelectionMenuItem";

interface IMoveSelectionMenuProps {
  combatant: IFriendlyCombatant;
}

export class MoveSelectionMenu extends React.Component<IMoveSelectionMenuProps> {
  public render(): JSX.Element {
    return (
      <div>
        <p>select a move for <strong>{this.props.combatant.name}</strong>:</p>
        <div>{this.moveButtons()}</div>
      </div>
    );
  }

  private moveButtons(): JSX.Element[] {
    const moves: IMove[] = this.props.combatant.moves;

    return moves.map(
      (move: IMove) => (
        <MoveSelectionMenuItem key={move.id} move={move} />
      ),
    );
  }
}
