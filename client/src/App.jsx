import "../src/assets/sass/App.scss";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./components/UserContext";
import PrivateRoute from "./components/PrivateRoute";

// Google gemini - API Key = AIzaSyDHVXMLWjBIl75xhXR-vl6qjHOqDrxLtd4

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Auth />} />
          {/* <Route
            path="/dashboard/*"
            element={<PrivateRoute element={Dashboard} />}
          /> */}
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
