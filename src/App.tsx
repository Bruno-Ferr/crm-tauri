import Login from "./pages/login/login";

import "./App.css";
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from "./layout/layout";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

function App() {
  const {user} = useContext(AuthContext)
  console.log(user)

  return (
    <Router>
      <div className="container">
        {user == undefined ? (
          <Login/>
        ) : (
          <Layout />
        )}
      </div>
    </Router>
  );
}

export default App;
