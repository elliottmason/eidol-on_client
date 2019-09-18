import { Router } from "@reach/router"
import React from "react";
import { connect, ConnectedComponentClass } from "react-redux";
import { Dispatch } from "redux";

import {
  IActionSyncMatch,
  IAppState,
  IMatch,
} from "./../interfaces";
import "./../stylesheets/App.css";
import { Index } from "./Index";
import { Match } from "./Match";

export interface IAppProps {
  match: IMatch;
  dispatch(func: {}): void;
}

class AppComponent extends React.Component<IAppProps> {
  public render(): JSX.Element {
    return (
      <Router style={{ height: "100%" }}>
        <Index path="/" />
        <Match path="/matches/:id" match={this.props.match} />
      </Router>
    );
  }
}

const mapStateToProps: (state: IAppState) => { match: IMatch } =
  (state: IAppState): { match: IMatch } => (
    { match: state.match }
  );

export const App:
  ConnectedComponentClass<typeof AppComponent, Pick<IAppProps, never>> =
  connect(mapStateToProps)(AppComponent);
