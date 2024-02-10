// Note: You **must** import React for static rendering to work.
// Also, you **must** use `export default` for your component.
import React from "https://esm.sh/react@18.2.0";

const App = () => {
  return (
    <>
    <html lang="en">
      <meta charSet="utf-8" />
      <body style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        margin: 0,
        padding: 0,
        fontFamily: "sans-serif",
        textAlign: "center",
        background: "linear-gradient(180deg, #000000 0%, #1D1D1D 100%)",
        color: "#fff",
      }}>
        <div>
          <h1>🪐 sup, universe!</h1>
          <p>This page was rendered with React & esbuild.</p>
        </div>
      </body>
      </html>
    </>
  );
};
export default App;
