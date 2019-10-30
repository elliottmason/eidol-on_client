import { List } from "immutable";
import React from "react";

import {
  ICombatant,
  IDeployedCombatantMoveSelection,
  IMatch,
  MatchContext,
} from "../../interfaces";

import { BenchedCombatantSelectionMenu } from "./BenchedCombatantSelectionMenu";
import { DeploymentConfirmationMenu } from "./DeploymentConfirmationMenu";
import { MatchUpdatePendingMenu } from "./MatchUpdatePendingMenu";
import { MoveSelectionConfirmationMenu } from "./MoveSelectionConfirmationMenu";
import { MoveSelectionMenu } from "./MoveSelectionMenu";

interface IMatchMenuProps {
  match: IMatch;
}

export class MatchMenu extends React.Component<IMatchMenuProps> {
  public render(): JSX.Element {
    switch (this.props.match.context.kind) {
      case ("matchUpdatePending"):
        return this.renderMatchUpdatePendingMenu();
      case ("benchedCombatantPlacement"):
      case ("benchedCombatantSelection"):
        return this.renderBenchedCombatantSelectionMenu();
      case ("combatantDeploymentConfirmation"):
        return this.renderDeploymentConfirmationMenu();
      case ("deployedCombatantMoveSelection"):
        return this.renderMoveSelectionMenu();
      case ("moveSelectionConfirmation"):
        return this.renderMoveSelectionConfirmationMenu();
      default:
        return <div />;
    }
  }

  private renderBenchedCombatantSelectionMenu(): JSX.Element {
    const benchedFriendlyCombatants: List<ICombatant> =
      this.props.match.combatants.filter(
        (combatant: ICombatant) =>
          combatant.isFriendly && combatant.boardPositionId === undefined,
      );

    return (
      <BenchedCombatantSelectionMenu
        combatants={benchedFriendlyCombatants}
      />
    );
  }

  private renderDeploymentConfirmationMenu(): JSX.Element {
    const { combatantDeployments } = this.props.match;

    return (
      <DeploymentConfirmationMenu
        combatantDeployments={combatantDeployments}
      />
    );
  }

  private readonly renderMatchUpdatePendingMenu: () => JSX.Element =
    (): JSX.Element => (
      <MatchUpdatePendingMenu />
    )

  private renderMoveSelectionConfirmationMenu(): JSX.Element {
    const { moveSelections } = this.props.match;

    return (
      <MoveSelectionConfirmationMenu
        moveSelections={moveSelections}
      />
    );
  }

  private renderMoveSelectionMenu(): JSX.Element {
    const matchContext: MatchContext = this.props.match.context;
    const combatantId: string =
      (matchContext as IDeployedCombatantMoveSelection).combatantId;
    const { combatants } = this.props.match;
    const combatant: ICombatant | undefined =
      combatants.find((potentialCombatant: ICombatant) =>
        (potentialCombatant.id === combatantId),
      );

    if (combatant !== undefined) {
      return (
        <MoveSelectionMenu
          combatant={combatant}
        />
      );
    }

    return <div />;
  }
}
