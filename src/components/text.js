import React from 'react';

import RequiredPoint from './requiredPoint';


export default class Text extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      text: ''
    };
  }
  
  componentDidMount () {
    fetch(this.props.src)
      .then(response => response.text())
      .then((response) => this.setState({text: response}));
  }

  renderRequired () {
    if (this.props.required) {
      return <RequiredPoint />;
    }
  }

  render () {
    return (
      <div id={this.props.id} className='text requiredPointFlex'>
        <div>
          {this.props.title ? [<h1 key='title'>{this.props.title}</h1>,
                              <p key='text'>{this.state.text}</p>] :
                              <p>{this.state.text}</p>}
        </div>
        {this.renderRequired()}
      </div>
    );
  }
}