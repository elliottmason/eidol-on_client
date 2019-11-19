import React, { CSSProperties } from "react";
import { connect } from "react-redux";

import {
  IActionDeployBenchedCombatant,
  IActionTargetBoardPosition,
  Id,
  MatchContext,
} from "../interfaces";

interface IBoardPositionProps {
  id: string;
  matchContext: MatchContext;
  x: number;
  y: number;
}

interface IBoardPositionComponentProps extends IBoardPositionProps {
  matchContext: MatchContext;
  dispatch(func: {}): void;
}

const deploySelectedBenchedCombatant: (boardPositionId: Id) =>
  IActionDeployBenchedCombatant =
  (boardPositionId: Id): IActionDeployBenchedCombatant => (
    {
      boardPositionId,
      type: "DEPLOY_BENCHED_COMBATANT",
    }
  );

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
      />
    );
  }

  private _handleClick(e: React.MouseEvent): void {
    const { dispatch } = this.props;

    switch (this.props.matchContext.kind) {
      case "benchedCombatantPlacement":
        dispatch(deploySelectedBenchedCombatant(this.props.id));
        break;
      case "deployedCombatantMoveTargeting":
        dispatch(targetPosition(this.props.id));
        break;
      default:
        return;
    }
  }

  private style(): CSSProperties {
    const borderWidth: number = 1;
    const size: number = 25;
    const bottom: number = this.props.y * size;
    const left: number = this.props.x * size;

    return {
      borderColor: "black",
      borderStyle: "solid",
      borderWidth: `${borderWidth}px`,
      bottom: `${bottom}vmin`,
      boxSizing: "border-box",
      height: `${size}vmin`,
      left: `${left}vmin`,
      position: "absolute",
      width: `${size}vmin`,
      zIndex: "auto",
    };
  }
}

interface IMappedProps {
  matchContext: MatchContext;
}

export const BoardPosition: React.ComponentClass<IBoardPositionProps> =
  connect()(BoardPositionComponent);
