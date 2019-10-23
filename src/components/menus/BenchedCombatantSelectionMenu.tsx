import { List } from "immutable";
import React from "react";

import { ICombatant } from "../../interfaces";

import { BenchedCombatantSelectionMenuItem } from "./BenchedCombatantSelectionMenuItem";

interface IBenchedCombatantSelectionMenuProps {
  combatants: List<ICombatant>;
}

export class BenchedCombatantSelectionMenu
  extends React.Component<IBenchedCombatantSelectionMenuProps> {

  public render(): JSX.Element {
    return (
      <div>
        Select an Eidol to deploy:
        {this.renderCombatantButtons()}
      </div>
    );
  }

  private renderCombatantButtons(): List<JSX.Element> {
    return (
      this.props.combatants.map(
        (combatant: ICombatant) => (
          <BenchedCombatantSelectionMenuItem
            key={combatant.id}
            combatant={combatant}
          />
        ),
      )
    );
  }
}
