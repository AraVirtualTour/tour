import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import LandingPage from './landingPage';
import { LocationList, Wayfinding } from './components';
import Tour from './tour';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';


const backendHost = `http://${window.location.hostname}`;
const backendPort = '8080';


class Index extends Component {
  constructor (props) {
    super(props);

    this.state = {
      wayfindingEnabled: false,
      showLocations: false,
      showTour: false,
      showWayfinding: false,
      locations: [],
      routes: [],
      visited: false
    }
  }

  componentDidMount () {
    if (JSON.parse(window.sessionStorage.getItem('visited'))) {
      this.setState({ showTour: true });
    } else {
      if (window.location.pathname.substring(1)) {
        window.sessionStorage.setItem('wayfindingEnabled', 'true');
        this.setState({ wayfindingEnabled: true });
      } else {
        window.sessionStorage.setItem('wayfindingEnabled', 'false');
        this.setState({ wayfindingEnabled: false });
      }
    }

    fetch(`${backendHost}:${backendPort}/content/locations.json`)
      .then(response => response.text())
      .then(text => this.setState({ locations: JSON.parse(text).locations })
    );
  }

  render() {
    return (
      <div id='index'>
        {!this.state.showLocations && !this.state.showTour && !this.state.showWayfinding
          ? <LandingPage parent={this} locationsData={this.state.locations} />
          : null
        }
        {this.state.showLocations
          ? <LocationList parent={this} locationsData={this.state.locations} />
          : null
        }
        {this.state.showTour
          ? <Tour parent={this} backendHost={backendHost} backendPort={backendPort} />
          : null
        }
        {this.state.showWayfinding
          ? <Wayfinding />
          : null
        }
      </div>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
