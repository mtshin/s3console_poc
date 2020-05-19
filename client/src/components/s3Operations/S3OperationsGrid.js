import React from "react";
import { Grid } from "@material-ui/core";
import PutFiles from "./PutFiles";
import ListFiles from "./ListFiles";

const S3OperationsGrid = () => {
  return (
    <div>
      <Grid container spacing={8} justify="center">
        <Grid item md="auto">
          <PutFiles />
        </Grid>

        <Grid item md="auto" style={{ display: "flex" }}>
          <ListFiles />
        </Grid>
      </Grid>
    </div>
  );
};

export default S3OperationsGrid;
