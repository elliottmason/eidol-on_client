import React from "react";
import { connect } from "react-redux";

import { IActionSelectMove, IMove } from "../interfaces";

interface IMoveSelectionMenuItemProps {
  move: IMove;
}

interface IMoveSelectionMenuItemComponentProps
  extends IMoveSelectionMenuItemProps {
  dispatch(func: {}): void;
}

const selectMove: (move: IMove) => IActionSelectMove =
  (move: IMove): IActionSelectMove => (
    {
      moveId: move.id,
      type: "SELECT_MOVE",
    }
  );

class MoveSelectionMenuItemComponent
  extends React.Component<IMoveSelectionMenuItemComponentProps> {
  private readonly handleClick: (e: React.MouseEvent) => void =
    this._handleClick.bind(this);

  public render(): JSX.Element {
    return (
      <button key={this.props.move.id} onClick={this.handleClick}>
        {this.props.move.name}
      </button>
    );
  }

  private _handleClick(event: React.MouseEvent): void {
    const { dispatch } = this.props;

    dispatch(selectMove(this.props.move));
  }
}

export const MoveSelectionMenuItem:
  React.ComponentClass<IMoveSelectionMenuItemProps> =
  connect()(MoveSelectionMenuItemComponent);
