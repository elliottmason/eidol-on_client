import { List } from "immutable";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import {
  IActionCancelMoveSelections,
  IActionSubmitMoveSelections,
  IAppState,
  IBoardPosition,
  ICombatant,
  Id,
  IMove,
  IMoveSelection,
} from "../../interfaces";
import { nullBoardPosition, nullCombatant, nullMove } from "../../nullObjects";

import { MoveSelectionConfirmationMenuItem } from "./MoveSelectionConfirmationMenuItem";

interface IMoveSelectionConfirmationMenuProps {
  moveSelections: List<IMoveSelection>;
}

interface IRealMoveSelection {
  boardPosition: IBoardPosition;
  combatant: ICombatant;
  move: IMove;
}

interface IMoveSelectionConfirmationMenuComponentProps {
  moveSelections: List<IRealMoveSelection>;
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

const cancelMoveSelections: () => IActionCancelMoveSelections =
  (): IActionCancelMoveSelections => (
    {
      type: "CANCEL_MOVE_SELECTIONS",
    }
  );

const submitMoveSelections:
  (moveSelections: List<IRealMoveSelection>) => Promise<Response> =
  async (moveSelections: List<IRealMoveSelection>): Promise<Response> => {
    const bodyArray: IMoveSelectionJson[] =
      moveSelections.map(
        (moveSelection: IRealMoveSelection) => (
          {
            board_position_id: moveSelection.boardPosition.id,
            match_combatants_move_id: moveSelection.move.id,
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

const confirmMoveSelections:
  (moveSelections: List<IRealMoveSelection>) =>
    (dispatch: Dispatch) =>
      Promise<void> =
  (moveSelections: List<IRealMoveSelection>):
    (dispatch: Dispatch) => Promise<void> => (
      (dispatch: Dispatch): Promise<void> => (
        submitMoveSelections(moveSelections)
          .then(
            (response: Response): void => {
              dispatch(awaitMatchUpdate());
            },
          )
      )
    );

class MoveSelectionConfirmationMenuComponent
  extends React.Component<IMoveSelectionConfirmationMenuComponentProps> {
  private readonly cancel: () => void = this._cancel.bind(this);

  private readonly confirm: () => void =
    this._confirm.bind(this);

  public render(): JSX.Element {
    return (
      <div>
        {this.renderMoveSelections()}
        <div>
          <button onClick={this.confirm}>Confirm</button>
          <button onClick={this.cancel}>Cancel</button>
        </div>
      </div>
    );
  }

  private _cancel(): void {
    const { dispatch } = this.props;

    dispatch(cancelMoveSelections());
  }

  private _confirm(): void {
    const { dispatch } = this.props;

    dispatch(confirmMoveSelections(this.props.moveSelections));
  }

  private renderMoveSelections(): List<JSX.Element> {
    const { moveSelections } = this.props;

    return moveSelections.map(
      (moveSelection: IRealMoveSelection) => (
        <MoveSelectionConfirmationMenuItem
          boardPosition={moveSelection.boardPosition}
          combatant={moveSelection.combatant}
          key={moveSelection.move.id}
          move={moveSelection.move}
        />
      )
    );
  }
}

const mapStateToProps:
  (
    state: IAppState,
    ownProps: IMoveSelectionConfirmationMenuProps,
  ) => { moveSelections: List<IRealMoveSelection> } =
  (
    state: IAppState,
    ownProps: IMoveSelectionConfirmationMenuProps,
  ): { moveSelections: List<IRealMoveSelection> } => {
    const moveSelections: List<IRealMoveSelection> =
      ownProps.moveSelections.map(
        (moveSelection: IMoveSelection) => {
          let boardPosition: IBoardPosition | undefined =
            state.match.boardPositions.find(
              (potentialBoardPosition: IBoardPosition) =>
                potentialBoardPosition.id === moveSelection.boardPositionId,
            );
          if (boardPosition === undefined) { boardPosition = nullBoardPosition; }

          let combatant: ICombatant | undefined =
            state.match.combatants.find(
              (potentialCombatant: ICombatant) =>
                potentialCombatant.id === moveSelection.combatantId,
            );
          if (combatant === undefined) { combatant = nullCombatant; }

          let move: IMove | undefined =
            combatant.moves.find(
              (potentialMove: IMove) =>
                potentialMove.id === moveSelection.moveId,
            );
          if (move === undefined) { move = nullMove; }

          return (
            {
              boardPosition,
              combatant,
              move,
            }
          );
        },
      );

    return ({ moveSelections });
  };

export const MoveSelectionConfirmationMenu:
  React.ComponentClass<IMoveSelectionConfirmationMenuProps> =
  connect(mapStateToProps)(MoveSelectionConfirmationMenuComponent);
