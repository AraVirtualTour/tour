import React from 'react';


export default class Panorama extends React.Component {
  render () {
    return (
      <div id={this.props.id} className='panorama'>
        {this.props.title ? [<h1 key='title'>{this.props.title}</h1>,
                            <img key='image' src={this.props.src} alt={this.props.alt} />] :
                            <img src={this.props.src} alt={this.props.alt} />}
      </div>
    );
  }
}
