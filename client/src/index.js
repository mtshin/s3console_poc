import * as serviceWorker from "./serviceWorker";
import React, { createRef } from "react";
import ReactDOM from "react-dom";
import { SnackbarProvider } from "notistack";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import App from "./App";

const notistackRef = createRef();
const onClickDismiss = (key) => () => {
  notistackRef.current.closeSnackbar(key);
};

ReactDOM.render(
  <SnackbarProvider
    ref={notistackRef}
    action={(key) => (
      <IconButton color="inherit" onClick={onClickDismiss(key)}>
        <CloseIcon />
      </IconButton>
    )}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    maxSnack={5}
  >
    <App />
  </SnackbarProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
