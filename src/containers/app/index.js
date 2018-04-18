import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import Home from "../home";

const App = () => (
  <div>
    <header>
      {/* <Link to="/">Home</Link> */}
      {/* <Link to="/about-us">About</Link> */}
    </header>

    <main>
      <Switch>
        <Route exact path="/" component={Home} />
        {/* <Route exact path="/about-us" component={About} /> */}
        <Redirect to="/" />
      </Switch>
    </main>
  </div>
);

export default App;
