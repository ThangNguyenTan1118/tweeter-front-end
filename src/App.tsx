import React from "react";
import "./App.css";
import { AuthProvider } from "./context/auth";
import { SignUp } from "./pages/SignUp";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <SignUp />
      </AuthProvider>
    </div>
  );
}

export default App;
