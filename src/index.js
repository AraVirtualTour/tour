import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import LandingPage from './landingPage';
import { LocationList, Wayfinding } from './components';
import Tour from './tour';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';


const backendHost = `http://${window.location.hostname}`;
const backendPort = '8081';


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
    fetch(`${backendHost}:${backendPort}/content/locations.json`)
      .then(response => response.text())
      .then(text => this.setState({ locations: JSON.parse(text).locations }, () => {
        if (JSON.parse(window.sessionStorage.getItem('visited'))) {
          this.setState({ showTour: true });
    
          if (JSON.parse(window.sessionStorage.getItem('wayfindingEnabled'))) {
            this.setState({ wayfindingEnabled: true });
          } else {
            this.setState({ wayfindingEnabled: false });
          }
        } else {
          if (window.location.pathname.substring(1)) {
            let foundLocation = false;

            window.sessionStorage.setItem('wayfindingEnabled', 'true');
            this.setState({ wayfindingEnabled: true });

            for (let location of this.state.locations) {
              if (window.location.pathname.includes(location.name) || window.location.pathname.includes('defend')) {
                foundLocation = true;
                break;
              }
            }

            if (!foundLocation) {
              window.location.pathname = '';
            }
          } else {
            window.sessionStorage.setItem('wayfindingEnabled', 'false');
            this.setState({ wayfindingEnabled: false });
          }
        }
      })
    );

    fetch(`${backendHost}:${backendPort}/content/locations.json`)
      .then(response => response.text())
      .then(text => this.setState({ routes: JSON.parse(text).routes })
    );
  }

  render() {
    return (
        <Router>
          <Route path='/**'>
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
                ? <Wayfinding parent={this} routeData={this.state.routes} />
                : null
              }
            </div>
          </Route>
        </Router>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
