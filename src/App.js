import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Datepicker from "./components/Datepicker.jsx";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Datepicker />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
