import React from "react";

import "./A.css";

const A = ({ name = "" }) => (
  <div className="a-style">
    A {name} <button onClick={() => alert("Hello World!")}>Click Me!</button>
  </div>
);

export default A;
