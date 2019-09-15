import { List } from "immutable";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
  IActionSubmitSelectedMoves,
  Id,
  IMoveSelection,
} from "../interfaces";

interface IMoveSelectionConfirmationMenuProps {
  moves: List<IMoveSelection>;
}

interface IMoveSelectionConfirmationMenuComponentProps
  extends IMoveSelectionConfirmationMenuProps {
  dispatch(func: {}): void;
}

interface IShit {
  board_position_id: Id | undefined;
  match_combatants_move_id: Id;
}

const awaitMatchUpdate: () => IActionSubmitSelectedMoves =
  (): IActionSubmitSelectedMoves => (
    {
      type: "SUBMIT_SELECTED_MOVES",
    }
  );

const submitSelectedMoves: () => Promise<Response> =
  (): Promise<Response> => (
    fetch("http://localhost:4000/match_move_selections", {
      method: "POST",
    })
  );

const confirmSelectedMoves = (
  (dispatch: Dispatch) => (
    submitSelectedMoves()
      .then(
        () => dispatch(awaitMatchUpdate()),
      )
  )
);

class MoveSelectionConfirmationMenuComponent
  extends React.Component<IMoveSelectionConfirmationMenuComponentProps> {
  private readonly confirm: (e: React.MouseEvent) => void =
    this._confirm.bind(this);

  public render(): JSX.Element {
    return (
      <div>
        <div>Ampul will Move to position 25</div>
        <div>Helljung will throw a Fireball at position 25</div>
        <button onClick={this.confirm}>Confirm</button>
      </div>
    );
  }

  private _confirm(e: React.MouseEvent): void {
    const { dispatch } = this.props;

    dispatch(confirmSelectedMoves);
  }
}

export const MoveSelectionConfirmationMenu:
  React.ComponentClass<IMoveSelectionConfirmationMenuProps> =
  connect()(MoveSelectionConfirmationMenuComponent);
