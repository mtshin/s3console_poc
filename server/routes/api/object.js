require("dotenv").config();
const https = require("https");
const express = require("express");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");

/**
 * express.Router() creates modular, mountable route handlers
 * A Router instance is a complete middleware and routing system; for this reason, often referred to as a “mini-app”.
 */
const router = express.Router();

// Ignore self signed certificates for s3 servers that use them (e.g. minio)
aws.NodeHttpClient.sslAgent = new https.Agent({ rejectUnauthorized: false });

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  Bucket: process.env.S3_BUCKET,
  //region: 'us-west-2',
  s3ForcePathStyle: true, // needed with minio? -> from minio docs
  sslEnabled: false,
  rejectUnauthorized: false,
  signatureVersion: "v4"
});

/**
 * Single Upload
 */
const putObject = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    }
  })
  // limits: { fileSize: 5000000 }, // In bytes, 5 MB.
}).single("object");

/**
 * @route POST api/object/putObject
 * @desc Upload file
 * @access public
 */
router.post("/putObject", (req, res) => {
  putObject(req, res, (error) => {
    if (error) {
      res.json({ error: error });
    } else {
      // If File not found
      if (req.file === undefined) {
        res.json("Error: No File Selected");
      } else {
        // If Success
        const fileName = req.file.key;
        const fileLocation = req.file.location;
        // Save the file information for components
        res.json({
          file: fileName,
          location: fileLocation,
          bucket: process.env.S3_BUCKET
        });
      }
    }
  });
});

/**
 * PUT Objects
 */
const putObjects = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    }
  })
  // limits: { fileSize: 5000000 }, // In bytes, 5 MB.
}).array("objects", 5);
/**
 * @route POST /api/profile/putObjects
 * @desc Upload multiple files at once as individual objects
 * @access public
 */
router.post("/putObjects", (req, res) => {
  putObjects(req, res, (error) => {
    if (error) {
      res.json({ error: error });
    } else {
      // If File not found
      if (req.files === undefined) {
        res.json("Error: No File Selected");
      } else {
        // If Success
        let fileArray = req.files,
          fileLocation;
        const fileLocationArray = [];
        for (let i = 0; i < fileArray.length; i++) {
          fileLocation = fileArray[i].location;
          fileLocationArray.push(fileLocation);
        }
        // Save the file information for components
        res.json({
          filesArray: fileArray,
          locationArray: fileLocationArray,
          bucket: process.env.S3_BUCKET
        });
      }
    }
  });
});

/**
 * @route GET api/object/getObject
 * @desc Upload file
 * @access public
 */
router.get("/getObject/:id", (req, res) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: req.params.id
  };

  s3.getObject(params)
    .createReadStream()
    .on("error", (error) => {
      res.status(error.statusCode).send({
        error: {
          status: error.statusCode,
          code: error.code,
          message: error.message
        }
      });
    })
    .pipe(res)
    .on("finish", () => {
      console.log(`GET request for ${params.Key} exited`);
    });
});

router.post("/deleteObject/:id", (req, res) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: req.params.id
  };

  s3.deleteObject(params)
    .createReadStream()
    .on("error", (error) => {
      res.status(error.statusCode).send({
        error: {
          status: error.statusCode,
          code: error.code,
          message: error.message
        }
      });
    })
    .pipe(res)
    .on("finish", () => {
      console.log(`DELETE request for ${params.Key} exited`);
    });
});

/**
 * @route GET api/object/listObjects
 * @desc List files in the bucket
 * @access public
 */
router.get("/listObjects", async (req, res) => {
  const param = {
    Bucket: process.env.S3_BUCKET
  };

  try {
    const allObjects = await getObjectListing(param);
    res.send(allObjects);
  } catch (error) {
    res.send(error);
  }
});

// Rescursively get a list of all objects in a bucket with consecutive asynchronous listObjects call (needed for buckets > 1000 objects).
const getObjectListing = async (param) => {
  const data = await s3.listObjectsV2(param).promise();
  let output = data.Contents === undefined ? [] : data.Contents;
  if (!data.IsTruncated) {
    // Exit condition when object listing is no longer truncated (last page)
    return output;
  } else {
    // Recurse if data is truncated
    param.ContinuationToken = data.NextContinuationToken;
    const nextListing = await getObjectListing(param);
    return output.concat(nextListing);
  }
};

// Export the router so that server.js can pick it up
module.exports = router;
