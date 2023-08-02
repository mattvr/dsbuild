import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  return (
    <div>
      <h1>🪐 sup, universe!</h1>
      <p>This page was rendered with React & esbuild.</p>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.querySelector("#root"),
);
root.render(
  <App />,
);
