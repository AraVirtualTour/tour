import React, { Component } from 'react';

import '../css/components.css';
import Button from 'react-bootstrap/Button';


export default class InstructionDialog extends Component {
  constructor (props) {
    super(props);

    this.state = {
      currentInstruction: 1
    }
  }

  openTour (location) {
    window.sessionStorage.setItem('visited', 'true');
    window.location.pathname = location;
  }

  render () {
    return (
      <div id='instructionsDialog'>
        <div id="instructionsOverlay"></div>
        <div id="instructions">
          <p>{this.props.route.steps[this.state.currentInstruction - 1].instruction}</p>
          <Button disabled={this.state.currentInstruction === 1}
                  onClick={() => this.setState({ currentInstruction: this.state.currentInstruction - 1 })}>
            {'<'}
          </Button>
          <Button disabled={this.state.currentInstruction === this.props.route.steps.length}
                  onClick={() => this.setState({ currentInstruction: this.state.currentInstruction + 1 })}>
            {'>'}
          </Button>
          {this.state.currentInstruction === this.props.route.steps.length
            ? (<Button onClick={() => this.openTour(this.props.location)}>
                Continue
              </Button>)
            : null
          }
        </div>
      </div>
    );
  }
}
