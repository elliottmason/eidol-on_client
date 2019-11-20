import { List } from "immutable";
import React, { CSSProperties } from "react";

import { IBoardPosition, IBoardProps, ICombatant } from "../interfaces";
import { nullBoardPosition } from "../nullObjects";

import { BoardPosition } from "./BoardPosition";
import { Combatant } from "./Combatant";

interface IDefaultProps {
  isReversed: boolean;
}

export class Board extends React.Component<IBoardProps> {
  public static defaultProps: IDefaultProps = {
    isReversed: false,
  };

  // tslint:disable-next-line: prefer-function-over-method
  public render(): JSX.Element {
    return (
      <div className="Board" style={this.style()}>
        {this.renderBoardPositions()}
        {this.renderCombatants()}
      </div>
    );
  }

  private boardDimensionSize(dimension: "x" | "y"): number {
    const coords: List<number> =
      this.props.positions.map(
        (position: IBoardPosition) => (position[dimension]),
      );

    return coords.reduce(
      (a: number, b: number) => (Math.max(a, b)),
    );
  }

  private boardHeight(): number {
    return this.boardDimensionSize("y");
  }

  private boardWidth(): number {
    return this.boardDimensionSize("x");
  }

  private renderBoardPositions(): List<JSX.Element> {
    return this.props.positions.map(
      (position: IBoardPosition) => {
        let x: number;
        let y: number;
        if (this.props.isReversed) {
          x = this.boardWidth() - position.x;
          y = this.boardHeight() - position.y;
        } else {
          x = position.x;
          y = position.y;
        }

        const { matchContext } = this.props;

        return (
          <BoardPosition
            id={position.id}
            key={position.id}
            matchContext={matchContext}
            x={x}
            y={y}
          />
        );
      },
    );
  }

  private renderCombatants(): List<JSX.Element> {
    const { combatants } = this.props;
    const deployedCombatants: List<ICombatant> =
      combatants.filter(
        (combatant: ICombatant) => combatant.boardPositionId !== undefined,
      );

    return deployedCombatants.map(
      (combatant: ICombatant) => {
        let actualBoardPosition: IBoardPosition | undefined =
          this.props.positions.find(
            (position: IBoardPosition): boolean =>
              (position.id === combatant.boardPositionId));
        if (actualBoardPosition === undefined) {
          actualBoardPosition = nullBoardPosition;
        }

        let boardPosition: IBoardPosition;
        if (this.props.isReversed) {
          boardPosition = {
            ...actualBoardPosition,
            x: this.boardWidth() - actualBoardPosition.x,
            y: this.boardHeight() - actualBoardPosition.y,
          };
        } else {
          boardPosition = actualBoardPosition;
        }

        return (
          <Combatant
            boardPosition={boardPosition}
            combatant={combatant}
            key={combatant.id}
          />
        );
      },
    );
  }

  private readonly style = (): CSSProperties => (
    {
      border: "1px solid #000",
      height: "100vmin",
      position: "relative",
      width: "100vmin",
    }
  )
}
