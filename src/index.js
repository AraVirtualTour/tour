import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch, Route 
} from 'react-router-dom';

import LandingPage from './landingPage';
import Tour from './tour';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';


class App extends React.Component {
  render () {
    return (
      <Router>
        <Switch>
          <Route path='/tour'>
            <Tour />
          </Route>
          <Route path='/'>
            <LandingPage />
          </Route>
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
