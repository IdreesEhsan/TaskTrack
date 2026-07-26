import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Mounts the React app into <div id="root"> from index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);