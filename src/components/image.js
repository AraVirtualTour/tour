import React from 'react';


export default class Image extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      imageElement: (
        <img key='image' src={this.props.src} alt={this.props.alt} />
      )
    };
  }

  render () {
    return (
      <div id={this.props.id} className='image content'>
        {this.props.title !== ''
          ? [<h1 key='title'>{this.props.title}</h1>, this.state.imageElement]
          : this.state.imageElement}
      </div>
    );
  }
}
