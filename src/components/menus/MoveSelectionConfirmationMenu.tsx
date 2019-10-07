import { List } from "immutable";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
  IActionSubmitMoveSelections,
  Id,
  IMoveSelection,
} from "../../interfaces";

interface IMoveSelectionConfirmationMenuProps {
  moveSelections: List<IMoveSelection>;
}

interface IMoveSelectionConfirmationMenuComponentProps
  extends IMoveSelectionConfirmationMenuProps {
  dispatch(func: {}): void;
}

interface IMoveSelectionJson {
  board_position_id: Id | undefined;
  match_combatants_move_id: Id;
}

const awaitMatchUpdate: () => IActionSubmitMoveSelections =
  (): IActionSubmitMoveSelections => (
    {
      type: "SUBMIT_MOVE_SELECTIONS",
    }
  );

const submitMoveSelections:
  (moveSelections: List<IMoveSelection>) => Promise<Response> =
  async (moveSelections: List<IMoveSelection>): Promise<Response> => {
    const bodyArray: IMoveSelectionJson[] =
      moveSelections.map(
        (moveSelection: IMoveSelection) => (
          {
            board_position_id: moveSelection.boardPositionId,
            match_combatants_move_id: moveSelection.moveId,
          }
        ),
      )
        .toArray();

    const bodyObject: {} = {
      match_move_selections: bodyArray,
    };

    const body: string = JSON.stringify(bodyObject);

    return fetch("http://localhost:4000/match_move_selections", {
      body,
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
  };

const confirmMoveSelections = (moveSelections: List<IMoveSelection>) => (
  (dispatch: Dispatch) => (
    submitMoveSelections(moveSelections)
      .then(
        (response: Response) => dispatch(awaitMatchUpdate()),
        (error) => console.error(error),
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

    dispatch(confirmMoveSelections(this.props.moveSelections));
  }
}

export const MoveSelectionConfirmationMenu:
  React.ComponentClass<IMoveSelectionConfirmationMenuProps> =
  connect()(MoveSelectionConfirmationMenuComponent);
