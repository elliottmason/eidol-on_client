import React, { CSSProperties } from "react";

import { IBoardPosition, IBoardProps } from "../interfaces";

import { BoardPosition } from "./BoardPosition";

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
      </div>
    );
  }

  private boardDimensionSize(dimension: "x" | "y"): number {
    const coords: number[] =
      this.props.board.map(
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

  private renderBoardPositions(): JSX.Element[] {
    return this.props.board.map(
      (boardPosition: IBoardPosition) => {
        let x: number;
        let y: number;
        if (this.props.isReversed) {
          x = this.boardWidth() - boardPosition.x;
          y = this.boardHeight() - boardPosition.y;
        } else {
          x = boardPosition.x;
          y = boardPosition.y;
        }

        return (
          <BoardPosition
            id={boardPosition.id}
            key={boardPosition.id}
            x={x}
            y={y}
          />
        );
      },
    );
  }

  private readonly style = (): CSSProperties => (
    {
      height: "403px",
      position: "relative",
      width: "403px",
    }
  )
}
