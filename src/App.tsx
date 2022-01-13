import React, { Fragment } from "react";
//import { Provider } from 'react-redux';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Inquiry from "./pages/Inquiry";
import Offer from "./pages/offer";
import "./App.css";

const App: React.FC = (props) => {
  return (
    //<Provider store={store}>
    <Fragment>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Inquiry" element={<Inquiry />} />
        <Route path="/Offer" element={<Offer />} />
      </Routes>
    </Fragment>
    //</Provider>
  );
};
export default App;
