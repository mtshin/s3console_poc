import React, { useState, createRef, useEffect } from "react";
import axios from "axios";
import download from "downloadjs";
import { Card, CardContent, Typography } from "@material-ui/core";
import { useSnackbar } from "notistack";
import MaterialTable from "material-table";

const ListFiles = () => {
  const [tableData, setTableData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const tableRef = createRef();

  useEffect(() => {
    listFilesHandler();
  }, []);

  const listFilesHandler = async () => {
    try {
      const response = await axios.get(`/api/object/listObjects`);
      if (response.data.statusCode && response.data.statusCode !== 200) {
        enqueueSnackbar(
          response.data.statusCode +
            " " +
            response.data.code +
            ". " +
            response.data.message +
            ".",
          {
            variant: "error"
          }
        );
      } else {
        const responseData = [];

        for (const dataEntry of response.data) {
          responseData.push(
            (({ Key, LastModified, Size, StorageClass }) => ({
              Key,
              LastModified,
              Size,
              StorageClass
            }))(dataEntry)
          );
        }
        setTableData(responseData);
      }
    } catch (error) {
      enqueueSnackbar(String(error), {
        variant: "error"
      });
    }
  };

  const getFileHandler = async (id) => {
    try {
      const response = await axios.get(`/api/object/getObject/${id}`, {
        responseType: "arraybuffer"
      });

      if (response.data.error) {
        enqueueSnackbar(response.data.error, {
          variant: "error"
        });
      } else {
        // Success
        download(response.data, `${id}`);
      }
    } catch (error) {
      if (error.toString().includes("404")) {
        enqueueSnackbar(`Could not find a file with object key ${id}`, {
          variant: "error"
        });
      } else {
        enqueueSnackbar(String(error), {
          variant: "error"
        });
      }
    }
  };

  const deleteFileHandler = async (id) => {
    try {
      const response = await axios.post(`/api/object/deleteObject/${id}`);

      if (response.data.error) {
        enqueueSnackbar(response.data.error, {
          variant: "error"
        });
      } else {
        // Success
        enqueueSnackbar(`${id} was successfully deleted`, {
          variant: "success"
        });
        listFilesHandler();
      }
    } catch (error) {
      enqueueSnackbar(String(error), {
        variant: "error"
      });
    }
  };

  return (
    <Card>
      <CardContent style={{ textAlign: "center" }}>
        <Typography variant={"h4"} gutterBottom>
          File list
        </Typography>
        <Typography variant={"subtitle1"}>
          List of files in the bucket
        </Typography>
        <MaterialTable
          tableRef={tableRef}
          columns={[
            { title: "Key", field: "Key" },
            { title: "Last Modified", field: "LastModified" },
            { title: "Size", field: "Size", type: "numeric" },
            {
              title: "Storage Class",
              field: "StorageClass"
            }
          ]}
          data={tableData}
          title="Demo Title"
          actions={[
            {
              icon: "refresh",
              tooltip: "Refresh",
              isFreeAction: true,
              onClick: () => {
                listFilesHandler();
              }
            },
            {
              icon: "save",
              tooltip: "Download file",
              onClick: (event, rowData) => getFileHandler(rowData.Key)
            },
            {
              icon: "delete",
              tooltip: "Delete File",
              onClick: (event, rowData) => deleteFileHandler(rowData.Key)
            }
          ]}
        />
      </CardContent>
    </Card>
  );
};
export default ListFiles;
