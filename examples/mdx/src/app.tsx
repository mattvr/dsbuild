import React from "react";
import ReactDOM from "react-dom/client";
import MyExample from "./MyExample.jsx";

const App = () => {
  return (
    <div>
      <MyExample />
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.querySelector("#root")!,
);
root.render(
  <App />,
);
