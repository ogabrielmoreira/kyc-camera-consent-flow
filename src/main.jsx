import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Sem StrictMode intencionalmente: o double-effect em dev reinicia os
// setTimeout das telas de liveness/processing e polui o protótipo.
// Em produção não faria diferença, mas é mais coerente manter dev = prod.
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
