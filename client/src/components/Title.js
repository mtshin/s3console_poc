import React from "react";
import { Typography, makeStyles } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "25px"
  },
  clickableIcon: {
    cursor: "pointer"
  }
}));

const Title = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5" gutterBottom>
        S3 Console PoC
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        A proof of concept react app to test aws sdk integration for javascript
      </Typography>
      <GitHubIcon
        className={classes.clickableIcon}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) =>
          window.open("https://github.com/mtshin/s3console_poc", "_blank")
        }
      />
    </div>
  );
};

export default Title;
