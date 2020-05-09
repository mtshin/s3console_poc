import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@material-ui/core";
import { useSnackbar } from "notistack";

const PutFiles = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const filesChangedText = () => {
    if (selectedFiles && !uploaded) {
      console.log(selectedFiles);
      if (selectedFiles.length === 1) {
        return (
          <Typography variant={"caption"}>
            {selectedFiles[0].name} selected
          </Typography>
        );
      } else if (selectedFiles.length > 1) {
        return (
          <Typography variant={"caption"}>
            {selectedFiles[0].name} and {selectedFiles.length - 1} more file(s)
            selected
          </Typography>
        );
      }
    }
  };

  const filesChangedHandler = (event) => {
    setUploaded(false);
    setSelectedFiles(event.target.files);
    console.log(event.target.files);

    enqueueSnackbar(`${event.target.files.length} file(s) chosen`, {
      variant: "success",
    });
  };

  const filesUploadHandler = async () => {
    const data = new FormData();
    // If file selected
    if (selectedFiles && selectedFiles[0]) {
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("objects", selectedFiles[i], selectedFiles[i].name);
      }
      const response = await axios.post("/api/object/putObjects", data, {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        },
      });
      try {
        console.log("res", response);
        if (200 === response.status) {
          if (response.data.error) {
            // If file size is larger than expected.
            if ("LIMIT_FILE_SIZE" === response.data.error.code) {
              enqueueSnackbar("Max size: 5MB", {
                variant: "error",
              });
              // If file count is larger than expected.
            } else if ("LIMIT_UNEXPECTED_FILE" === response.data.error.code) {
              enqueueSnackbar("Max 5 files allowed", {
                variant: "error",
              });
            } else {
              // If not the given file type (mimtype or filetype)
              enqueueSnackbar(response.data.error, {
                variant: "error",
              });
            }
          } else {
            // Success
            let fileResponse = response.data;
            console.log("fileName", fileResponse);
            console.log(fileResponse.bucket);
            enqueueSnackbar(
              `${fileResponse.filesArray.length} file(s) uploaded to ${fileResponse.bucket}`,
              {
                variant: "success",
              }
            );
            setUploaded(true);
          }
        }
      } catch (error) {
        // If another error
        enqueueSnackbar(error, {
          variant: "error",
        });
      }
    } else {
      // If file not selected
      enqueueSnackbar("Please upload file(s)", {
        variant: "error",
      });
    }
  };

  return (
    <Card>
      <CardContent style={{ textAlign: "center" }}>
        <Typography variant={"h4"} gutterBottom>
          Upload File
        </Typography>
        <Typography variant={"subtitle1"}>
          Upload file(s) to a bucket
        </Typography>
        <CardActions style={{ justifyContent: "center" }}>
          <Button variant="contained" component="label">
            Choose File(s)
            <input
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={filesChangedHandler}
            />
          </Button>
          <Button size="medium" color="primary" onClick={filesUploadHandler}>
            Upload
          </Button>
        </CardActions>
        {filesChangedText()}
      </CardContent>
    </Card>
  );
};

export default PutFiles;
