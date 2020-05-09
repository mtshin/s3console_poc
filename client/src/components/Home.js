import React from "react";
import S3OperationsGrid from "./s3Operations/S3OperationsGrid";

const Home = () => {
  return (
    <div>
      <div className="container">
        <S3OperationsGrid />
      </div>
    </div>
  );
};

export default Home;
