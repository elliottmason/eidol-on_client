import React from "react";
import { connect } from "react-redux"

import {
  IActionSelectCombatantForDeployment,
  ICombatant,
  Id,
} from "../../interfaces";

interface IBenchedCombatantSelectionMenuItemProps {
  combatant: ICombatant;
}

interface IBenchedCombatantSelectionMenuItemComponentProps
  extends IBenchedCombatantSelectionMenuItemProps {
  dispatch(func: {}): void;
}

const selectCombatantForDeployment:
  (combatantId: Id) => IActionSelectCombatantForDeployment =
  (combatantId: Id): IActionSelectCombatantForDeployment => (
    {
      combatantId,
      type: "SELECT_COMBATANT_FOR_DEPLOYMENT",
    }
  );

class BenchedCombatantSelectionMenuItemComponent
  extends React.Component<IBenchedCombatantSelectionMenuItemComponentProps> {
  private readonly selectCombatantForDeployment: (e: React.MouseEvent) => void =
    this._selectCombatantForDeployment.bind(this);

  public render(): JSX.Element {
    return (
      <button
        key={this.props.combatant.id}
        onClick={this.selectCombatantForDeployment}
        style={{ display: "block" }}
      >
        {this.props.combatant.name}
      </button>
    );
  }

  private _selectCombatantForDeployment(e: React.MouseEvent): void {
    const { combatant, dispatch } = this.props;

    dispatch(selectCombatantForDeployment(combatant.id));
  }
}

export const BenchedCombatantSelectionMenuItem:
  React.ComponentClass<IBenchedCombatantSelectionMenuItemProps> =
  connect()(BenchedCombatantSelectionMenuItemComponent);
