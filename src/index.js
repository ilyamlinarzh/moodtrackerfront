/* eslint-disable */
import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import { StorageProvider } from "./hoc/StorageProvider";

bridge.send("VKWebAppInit");

const AppBlock = () => {
  return(
      <StorageProvider>
        <App />
      </StorageProvider>
  )
}

ReactDOM.render(<AppBlock />, document.getElementById("root"));
// if (process.env.NODE_ENV === "development" || true) {
//   import("./eruda").then(({ default: eruda }) => {}); //runtime download
// }
