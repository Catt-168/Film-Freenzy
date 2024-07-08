import React, { useEffect, useState } from "react";
import restClient from "../../helpers/restClient";
import { STATUS_TYPE } from "../../helpers/constants";

export default function useFetch(url) {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState(STATUS_TYPE.idle);

  async function fetchData() {
    setStatus(STATUS_TYPE.loading);
    try {
      const { data } = await restClient.get(url);
      setData(data);
      setStatus(STATUS_TYPE.success);
    } catch (e) {
      setStatus(STATUS_TYPE.error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [url]);

  const isLoading = status === STATUS_TYPE.loading;
  const isError = status === STATUS_TYPE.error;

  return { data, isLoading, isError };
}
