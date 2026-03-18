import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";

// Inicializa o aplicativo React dentro da div #root do index.html
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);