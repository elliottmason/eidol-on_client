import React from "react";

import { IBoardPosition, ICombatant, IMove } from "../../interfaces";

interface IMoveSelectionConfirmationMenuItemProps {
  boardPosition?: IBoardPosition;
  combatant: ICombatant;
  move: IMove;
}

export class MoveSelectionConfirmationMenuItem
  extends React.Component<IMoveSelectionConfirmationMenuItemProps> {
  public render(): JSX.Element {
    const { boardPosition, combatant, move } = this.props;

    return (
      <div>
        {combatant.name} will use {move.name}
      </div>
    );
  }
}
