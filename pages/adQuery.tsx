import React from "react";
import AdQueryWrap from "../components/adQuery/adQuery";

interface AdQueryProps {}

const AdQuery: React.FC<AdQueryProps> = ({ children }) => {
  return (
    <>
      <AdQueryWrap />
    </>
  );
};

export default AdQuery;
