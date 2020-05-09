import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const Header = () => {
  return (
    <AppBar color="primary" position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit">
          Hitachi Vantara
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
