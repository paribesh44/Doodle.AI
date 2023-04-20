import axios from "axios";
import { useEffect, useState } from "react";

const useAPI = (
  {
    endpoint,
    method = "GET",
    params = null,
    data = null,
    withCredentials = true,
    fire = true,
  },
  formatter,
  defaults = null
) => {
  const [responseState, setResponseState] = useState({
    response: defaults,
    complete: false,
  });
  useEffect(() => {
    if (fire) {
      let url = `http://localhost:8000${endpoint}`;
      let config = {
        withCredentials: withCredentials,
        params: params,
      };
      let promiseObj = null;

      switch (method) {
        case "POST":
          promiseObj = new axios.post(url, data, config);
          break;

        case "GET":
          promiseObj = new axios.get(url, config);
          break;
      }

      promiseObj
        .then((res) => {
          let formattedRes = res;

          if (formatter) {
            formattedRes = formatter(res);
          }
          setResponseState({ response: formattedRes, complete: true });
        })
        .catch((error) => {
          if (error.response == null) {
            throw error;
          }
          if (error.response.status === 401) {
            localStorage.clear();
            window.location = "/"
            setResponseState({ response: error.response, complete: true });
          }
        });
    }
    return () => {
      setResponseState({});
    };
  }, [endpoint, method, params, data, setResponseState, fire]);

  return Object.values(responseState);
};

export default useAPI;