import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

const container = document.createElement("div");

container.id = "olyafilatov-skill-highlight-extension-root";

const shadowRoot = container.attachShadow({
  mode: "open",
});

document.body.appendChild(container);

const reactRoot = document.createElement("div");

shadowRoot.appendChild(reactRoot);

ReactDOM.createRoot(
    reactRoot
).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
