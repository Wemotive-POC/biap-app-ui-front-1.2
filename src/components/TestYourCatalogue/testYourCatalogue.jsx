import React, { useState } from "react";
import "./testYourCatalogue.css";
import Layout from "./components/Layout/Layout";
import Request from "./components/Workspace/Request/Request";
import Response from "./components/Workspace/Response/Response";

const TestYourCatalogue = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="test-your-catalogue">
      <Layout>
        <Request setResponse={setResponse} setLoading={setLoading} />
        <Response response={response} loading={loading} />
      </Layout>
    </div>
  );
};

export default TestYourCatalogue;
