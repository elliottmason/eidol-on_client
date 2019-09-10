import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { App } from "./components/App";
import { store } from "./configureStore";
import * as serviceWorker from "./serviceWorker";
import "./stylesheets/index.css";

const rootElement: HTMLElement | null = document.getElementById("root");

ReactDOM.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  rootElement,
);

serviceWorker.unregister();
