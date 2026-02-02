import { BrowserRouter } from "react-router-dom";
// import "./App.css";
import React from "react";
import AppRouters from "./router/AppRoutes";
import { AuthProvider } from "./context/AuthProvider";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRouters />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
