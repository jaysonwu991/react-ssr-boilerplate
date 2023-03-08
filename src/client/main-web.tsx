import React from "react";
import { hydrate } from "react-dom";
import { loadableReady } from "@loadable/component";
import App from "./App";

loadableReady(() => {
  let initialData: { appProps?: { name: string } } = {};
  if (typeof window !== undefined && window?.INITIAL_DATA) {
    initialData = window?.INITIAL_DATA;
  }

  const root = document.getElementById("main");
  hydrate(<App {...initialData?.appProps} />, root);
});
