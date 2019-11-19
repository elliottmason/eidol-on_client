import { List } from "immutable";
import React from "react";

import { ICombatant, IMove } from "../../interfaces";

import { MoveSelectionMenuItem } from "./MoveSelectionMenuItem";

interface IMoveSelectionMenuProps {
  combatant: ICombatant;
}

export class MoveSelectionMenu
  extends React.Component<IMoveSelectionMenuProps> {
  public render(): JSX.Element {
    return (
      <div>
        <p>select a move for <strong>{this.props.combatant.name}</strong>:</p>
        {this.moveButtons()}
      </div >
    );
  }

  private moveButtons(): JSX.Element {
    const moves: List<IMove> = this.props.combatant.moves;

    const buttons: List<JSX.Element> = moves.map(
      (move: IMove) => (
        <MoveSelectionMenuItem key={move.id} move={move} />
      ),
    );

    return (<div>{buttons}</div>);
  }
}
