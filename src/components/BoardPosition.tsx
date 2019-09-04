import React from "react";

interface ICoordinates {
  x: number;
  y: number;
}

interface IBoardPositionProps {
  coords: ICoordinates;
  id: string;
}

class BoardPosition extends React.Component<IBoardPositionProps> {
  // tslint:disable-next-line: prefer-function-over-method
  public render(): JSX.Element {
    return (
      <div />
    );
  }
}
