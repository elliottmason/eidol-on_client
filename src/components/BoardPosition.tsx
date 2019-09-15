import { List } from "immutable";
import React, { CSSProperties } from "react";
import { connect } from "react-redux";

import {
  IActionTargetBoardPosition,
  IAppState,
  ICombatant,
  Id,
  MatchContext,
} from "../interfaces";

import { EnemyCombatant } from "./EnemyCombatant";
import { FriendlyCombatant } from "./FriendlyCombatant";

interface IBoardPositionProps {
  id: string;
  x: number;
  y: number;
}

interface IBoardPositionComponentProps extends IBoardPositionProps {
  matchContext: MatchContext;
  occupants: List<ICombatant>;
  dispatch(func: {}): void;
}

const targetPosition: (boardPositionId: Id) => IActionTargetBoardPosition =
  (boardPositionId: Id): IActionTargetBoardPosition => (
    {
      boardPositionId,
      type: "TARGET_BOARD_POSITION",
    }
  );

class BoardPositionComponent
  extends React.Component<IBoardPositionComponentProps> {
  private readonly handleClick: (e: React.MouseEvent) => void =
    this._handleClick.bind(this);

  public render(): JSX.Element {
    return (
      <div
        className="BoardPosition"
        onClick={this.handleClick}
        style={this.style()}
      >
        {this.renderOccupants()}
      </div>
    );
  }

  private _handleClick(e: React.MouseEvent): void {
    const { dispatch } = this.props;

    switch (this.props.matchContext.kind) {
      case "deployedCombatantMoveTargeting":
        dispatch(targetPosition(this.props.id));
        break;
      default:
        return;
    }
  }

  private renderOccupants(): List<JSX.Element> {
    const occupants: List<JSX.Element> = this.props.occupants.map(
      (combatant: ICombatant) => {
        if (combatant.isFriendly) {
          return (
            <FriendlyCombatant
              key={combatant.id}
              combatant={combatant}
            />
          );
        }

        return (
          <EnemyCombatant
            key={combatant.id}
            combatant={combatant}
          />
        );
      },
    );

    return occupants;
  }

  private style(): CSSProperties {
    const boardSquareSize: number = 150;
    const borderWidth: number = 2;
    const bottom: number = this.props.y * boardSquareSize;
    const left: number = this.props.x * boardSquareSize;
    const size: number = boardSquareSize - borderWidth;

    return {
      borderColor: "black",
      borderStyle: "solid",
      borderWidth: `${borderWidth}px`,
      bottom: `${bottom}px`,
      height: `${size}px`,
      left: `${left}px`,
      position: "absolute",
      width: `${size}px`,
      zIndex: "auto",
    };
  }
}

interface IMappedProps {
  matchContext: MatchContext;
  occupants: List<ICombatant>;
}

const mapStateToProps: (
  state: IAppState,
  ownProps: { id: Id },
) => IMappedProps = (
  state: IAppState,
  ownProps: { id: Id },
  ): IMappedProps => {
    const boardPositionId: Id = ownProps.id;
    const occupants: List<ICombatant> =
      state.match.combatants.filter(
        (combatant: ICombatant) =>
          (combatant.boardPositionId === boardPositionId),
      );

    return {
      matchContext: state.match.context,
      occupants,
    };
  };

export const BoardPosition: React.ComponentClass<IBoardPositionProps> =
  connect(mapStateToProps)(BoardPositionComponent);
