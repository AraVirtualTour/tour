import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

import InstructionDialog from './instructionDialog';

import '../css/components.css';


export default class Wayfinding extends Component {
  constructor (props) {
    super(props);

    this.state = {
      showInstructions: false,
      location: '',
      steps: []
    };
  }

  openInstructions (route) {
    this.setState({ showInstructions: true, location: route.endLocation, route: route });
  }

  renderList () {
    let routes = [];
    let locations = [];
    let totalDistance = 0;

    for (let data of this.props.routeData) {
      if (data.startLocation === window.location.pathname.substring(1)) {
        routes.push(data);
      }
    }

    for (let route of routes) {
      if (totalDistance === 0) totalDistance = route.totalDistance;

      if (route.totalDistance < totalDistance) {
        totalDistance = route.totalDistance;
      }
    }

    for (let route of routes) {
      if (totalDistance === route.totalDistance) {
        locations.push(
          <Button key={`${route.startLocation}-${route.endLocation}`} onClick={() => this.openInstructions(route)}>
            {route.endLocation}
          </Button>
        );
      }
    }

    return locations;
  }

  render () {
    return (
      <div id='wayfindingMap'>
        {this.state.showInstructions
          ? <InstructionDialog location={this.state.location} route={this.state.route} />
          : null
        }
        {this.renderList()}
      </div>
    );
  }
}
