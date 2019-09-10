import React from "react";

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
      <div>
        {this.renderBoardPositions()}
      </div>
    );
  }

  public renderBoardPositions(): JSX.Element[] {
    return this.props.board.map(
      (boardPosition: IBoardPosition) => {
        if (this.props.isReversed) {
          const boardSizeWhichShouldNotBeHardcodedHere: number = 3;
          const x: number =
            boardSizeWhichShouldNotBeHardcodedHere - boardPosition.x;
          const y: number =
            boardSizeWhichShouldNotBeHardcodedHere - boardPosition.y;
        } else {
          const { x, y } = boardPosition;
        }

        return (
          <BoardPosition
            id={boardPosition.id}
            key={boardPosition.id}
            x={boardPosition.x}
            y={boardPosition.y}
          />
        );
      },
    );
  }
}
