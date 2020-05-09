import React from "react";
import { Grid } from "@material-ui/core";
import PutFiles from "./PutFiles";
import GetFile from "./GetFile";

const S3OperationsGrid = () => {
  return (
    <div>
      <Grid container spacing={4} justify="center">
        <Grid item md={4} style={{ display: "flex" }}>
          <PutFiles />
        </Grid>
        <Grid item md={4} style={{ display: "flex" }}>
          <GetFile />
        </Grid>
      </Grid>
    </div>
  );
};

export default S3OperationsGrid;
