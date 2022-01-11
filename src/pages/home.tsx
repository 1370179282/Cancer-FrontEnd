import React from "react";
import { renderRoutes } from "react-router-config";

const Home = (props) => {
  const route = props.route;

  return (
    <div>
      <div>this is Home page.</div>
      {route && renderRoutes(route.routes)}
    </div>
  );
};

export default Home;
