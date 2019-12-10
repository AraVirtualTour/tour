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
    console.log(route.endLocation)
    this.setState({ showInstructions: true, location: route.endLocation, route: route });
  }

  renderList () {   
    let locations = [];

    for (let data of this.props.routeData) {
      if (data.startLocation === window.location.search.substring(1)) {
        locations.push(
          <Button key={`${data.startLocation}-${data.endLocation}`} onClick={() => this.openInstructions(data)}>
            {data.endLocation}
          </Button>
        );
      }
    }

    return locations;
  }

  render () {
    console.log(this.props.routeData)
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
