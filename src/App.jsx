import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import "./index.css";
import store from "./Redux/Store.jsx";
import User from "./User.jsx";
import Admin from "./Admin.jsx";

function App() {
  return (
    <>
      <ToastContainer />
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/*" element={<User />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </Router>
      </Provider>
    </>
  );
}

export default App;
