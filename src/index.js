import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import LandingPage from './landingPage';
import Tour from './tour';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';


const backendHost = `http://${window.location.hostname}`;
const backendPort = '8080';


class Index extends Component {
  constructor (props) {
    super(props);

    this.state = {
      showLocations: false,
      locations: []
    }
  }

  componentDidMount () {
    if (window.location.pathname.substring(1) && !window.sessionStorage.getItem('wayfindingEnabled')) {
      window.sessionStorage.setItem('wayfindingEnabled', 'true');
    } else {
      window.sessionStorage.setItem('wayfindingEnabled', 'false');
    }

    fetch(`${backendHost}:${backendPort}/content/locations.json`)
      .then(response => response.text())
      .then(text => this.setState({ locations: JSON.parse(text).locations }));
  }

  createRoutes () {
    let routes = [];
    
    for (let location of this.state.locations) {
      routes.push(
        <Route key={`route${location.name}`} path={`/${location.name}`}>
          <Tour locations={this.state.locations} backendHost={backendHost} backendPort={backendPort} />
        </Route>
      );
    }

    return routes;
  }

  render() {
    return (
      <Router>
        <Switch>
          {this.createRoutes()}
          <Route path="/">
            <LandingPage locationsData={this.state.locations} />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
