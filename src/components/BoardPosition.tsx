import React, { CSSProperties } from "react";
import { connect } from "react-redux";

import { IAppState, ICombatant, Id, IEnemyCombatant, IFriendlyCombatant } from "../interfaces";

import { EnemyCombatant } from "./EnemyCombatant";
import { FriendlyCombatant } from "./FriendlyCombatant";

interface IBoardPositionProps {
  id: string;
  occupants: ICombatant[];
  x: number;
  y: number;
}

interface IDefaultProps {
  occupants: ICombatant[];
}

class BoardPositionComponent
  extends React.Component<IBoardPositionProps> {
  public static defaultProps: IDefaultProps = {
    occupants: [],
  };

  // tslint:disable-next-line: prefer-function-over-method
  public render(): JSX.Element {
    return (
      <div style={this.style()}>
        {this.renderOccupants()}
      </div>
    );
  }

  private renderOccupants(): JSX.Element[] {
    return this.props.occupants.map(
      (combatant: ICombatant) => {
        if (combatant.isFriendly) {
          return (
            <FriendlyCombatant
              key={combatant.id}
              combatant={combatant as IFriendlyCombatant}
            />
          );
        }

        return (
          <EnemyCombatant
            key={combatant.id}
            combatant={combatant as IEnemyCombatant}
          />
        );
      },
    );
  }

  private style(): CSSProperties {
    const boardSquareSize: number = 100;
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

const mapStateToProps: (
  state: IAppState,
  ownProps: IBoardPositionProps,
) => IBoardPositionProps = (
  state: IAppState,
  ownProps: IBoardPositionProps,
  ): IBoardPositionProps => {
    const boardPositionId: Id = ownProps.id;
    const occupants: ICombatant[] =
      state.match.combatants.filter(
        (combatant: ICombatant) =>
          (combatant.boardPositionId === boardPositionId),
      );

    return {
      occupants,
      ...ownProps,
    };
  };

export const BoardPosition: React.ComponentClass<IBoardPositionProps> =
  connect(mapStateToProps)(BoardPositionComponent);
