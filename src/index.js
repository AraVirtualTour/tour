import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route 
} from "react-router-dom";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import LandingPage from './landingPage';
import Tour from './tour';
import Wayfinding from './wayfinding'

class App extends React.Component {
  render () {
    return (
      <Router>
        <Switch>
          <Route path="/tour">
            <Tour />
          </Route>
          <Route path="/wayfinding">
            <Wayfinding />
          </Route>
          <Route path="/">
            <LandingPage />
          </Route>
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
