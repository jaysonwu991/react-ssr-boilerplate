import "core-js";
import React from "react";
import loadable from "@loadable/component";

import "./main.css";

const A = loadable(() => import("./letters/A"));
const B = loadable(() => import("./letters/B"));
const C = loadable(() => import(/* webpackPreload: true */ "./letters/C"));
const D = loadable(() => import(/* webpackPrefetch: true */ "./letters/D"));
const E = loadable(() => import("./letters/E"), { ssr: false });
const Y = loadable(
  (props: { letter: string }) => import(`./letters/${props.letter}/file`)
);
const Z = loadable(
  (props: { letter: string }) => import(`./letters/${props.letter}/file`)
);

// Load 'G' component twice: once in SSR and once fully client-side
const GClient = loadable(() => import("./letters/G"), {
  ssr: false,
  fallback: <span className="loading-state">ssr: false - Loading...</span>,
});
const GServer = loadable(() => import("./letters/G"), {
  ssr: true,
  fallback: <span className="loading-state">ssr: true - Loading...</span>,
});

const App = ({ name }: { name?: string }) => (
  <div className="container">
    <A name={name} />
    <B />
    <C />
    <D />
    <E />
    <GClient prefix="ssr: false" />
    <GServer prefix="ssr: true" />
    <Y letter="Y" />
    <Z letter="Z" />
  </div>
);

export default App;
