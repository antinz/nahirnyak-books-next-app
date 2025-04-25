import React from "react";
import { ClipLoader } from "react-spinners";

function LoadingSpinner({ loading }) {
  return (
    <div className="flex justify-center mt-15">
      {loading && <ClipLoader size={50} color="#000000" />}
    </div>
  );
}

export default LoadingSpinner;
