import { Router } from "@reach/router";
import React from "react";
import { connect, ConnectedComponentClass } from "react-redux";

import {
  IAppState,
  IMatch,
} from "./../interfaces";
import "./../stylesheets/App.css";
import { Dashboard } from "./Dashboard";
import { Match } from "./Match";
import { Signin } from "./Signin";

export interface IAppProps {
  match: IMatch;
  dispatch(func: {}): void;
}

class AppComponent extends React.Component<IAppProps> {
  public render(): JSX.Element {
    return (
      <Router style={{ height: "100%" }}>
        <Dashboard path="/" />
        <Match path="/matches/:id" match={this.props.match} />
        <Signin path="/sign_in" />
      </Router>
    );
  }
}

const mapStateToProps: (state: IAppState) => { match: IMatch } =
  (state: IAppState): { match: IMatch } => ({ match: state.match });

export const App:
  ConnectedComponentClass<typeof AppComponent, Pick<IAppProps, never>> =
  connect(mapStateToProps)(AppComponent);
