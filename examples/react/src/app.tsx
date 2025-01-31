import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h1>🪐 sup, universe!</h1>
      <p>This page was rendered with React & esbuild.</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

const root = ReactDOM.createRoot(
  globalThis.document.querySelector("#root")!,
);
root.render(
  <App />,
);
