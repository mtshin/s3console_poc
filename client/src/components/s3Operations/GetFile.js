import React, { useState } from "react";
import axios from "axios";
import download from "downloadjs";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  TextField,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";

const GetFile = () => {
  const [id, setId] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const getFileHandler = async () => {
    try {
      const response = await axios.get(`/api/object/getObject/${id}`, {
        responseType: "arraybuffer",
      });

      /**
       * Success/Error handling. Some of these are commented out (e.g. file size limit) in the actual request
       */

      console.log(response);

      if (200 === response.status) {
        // If there was an error in the GET follwing successful response
        if (response.data.error) {
          enqueueSnackbar(response.data.error, {
            variant: "error",
          });
        } else {
          // Success
          enqueueSnackbar(`File found. Download initiated for ${id}`, {
            variant: "success",
          });
          download(response.data, `${id}`);
          enqueueSnackbar(`${id} has finished downloading!`, {
            variant: "success",
          });
          setId("");
        }
      } else {
        console.log(response);
      }
    } catch (error) {
      if (error.toString().includes("404")) {
        enqueueSnackbar(`Could not find a file with object key ${id}`, {
          variant: "error",
        });
      }
    }
  };

  return (
    <Card>
      <CardContent style={{ textAlign: "center" }}>
        <Typography variant={"h4"} gutterBottom>
          Get File
        </Typography>
        <Typography variant={"subtitle1"}>
          Enter the file's object key to download it from a bucket
        </Typography>
        <CardActions style={{ justifyContent: "center" }}>
          <TextField
            label="Object Key"
            onChange={(event) => {
              setId(event.target.value);
            }}
            value={id}
          ></TextField>
          <Button size="medium" color="primary" onClick={getFileHandler}>
            Download
          </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};
export default GetFile;
