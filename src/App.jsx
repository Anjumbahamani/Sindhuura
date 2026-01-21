import { BrowserRouter } from "react-router-dom";
// import "./App.css";
import React from "react";
import AppRouters from "./router/AppRoutes";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
   
     <AuthProvider>
      <AppRouters />
    </AuthProvider>


    

  
  );
}

export default App;
