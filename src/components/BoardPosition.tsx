import { List } from "immutable";
import React, { CSSProperties } from "react";
import { connect } from "react-redux";

import {
  IActionDeployBenchedCombatant,
  IActionTargetBoardPosition,
  IAppState,
  ICombatant,
  Id,
  MatchContext,
} from "../interfaces";

import { Combatant } from "./Combatant";

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
      >
        {this.renderOccupants()}
      </div>
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

  private renderOccupants(): List<JSX.Element> {
    const occupants: List<JSX.Element> = this.props.occupants.map(
      (combatant: ICombatant) => (
        <Combatant
          key={combatant.id}
          combatant={combatant}
        />
      ),
    );

    return occupants;
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
