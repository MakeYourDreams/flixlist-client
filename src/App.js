import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import PrivateRoute from "./components/PrivateRoute";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Weekly from "./views/Weekly";
import Favorites from "./components/Favorites";
import {MovieContent} from './components/MovieContent';

import { useAuth0 } from "./react-auth0-spa";
import history from "./utils/history";

// styles
import "./App.css";
import "./style.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

const App = () => {
  const { loading } = useAuth0();

  if (loading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/weekly" exact component={Weekly} />
            <Route path="/movie/:id" exact component={MovieContent} />
            <PrivateRoute path="/favorites" exact component={Favorites} />
            {/* <Route path='/movie/:id' render={(props) => <MovieProduct {...props}/>}/> */}
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/login" component={Home} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
