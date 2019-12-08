import React from 'react';


export default class Panorama extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      panoramaElement: (
        <img key='image' src={this.props.src} alt={this.props.alt} />
      )
    };
  }
  render () {
    return (
      <div id={this.props.id} className='panorama content'>
        {this.props.title ? <h1 key='title'>{this.props.title}</h1> : null}
        <div>
          {this.state.panoramaElement}
        </div>
      </div>
    );
  }
}
